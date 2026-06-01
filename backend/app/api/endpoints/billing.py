from fastapi import APIRouter, Request, HTTPException, Depends
from app.services import stripe_service
from app.api.dependencies import get_current_user
import os
from app import crud

import stripe

STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")

router = APIRouter()


@router.post("/create-checkout")
async def create_checkout(request: Request, current_user=Depends(get_current_user)):
    body = await request.json()
    price_id = body.get("price_id")
    success_url = body.get("success_url")
    cancel_url = body.get("cancel_url")
    session = stripe_service.create_checkout_session(current_user.email, price_id, success_url, cancel_url)
    return {"id": session.id, "url": session.url}


@router.post("/webhook")
async def webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    event = None
    try:
        if STRIPE_WEBHOOK_SECRET and sig_header:
            event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
        else:
            import json
            event = json.loads(payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid payload: {e}")

    etype = event.get("type") if isinstance(event, dict) else event.type

    # Handle subscription created
    data = event.get("data", {}).get("object") if isinstance(event, dict) else event.data.get("object")
    try:
        if etype == "customer.subscription.created" or etype == "customer.subscription.updated":
            sub_id = data.get("id")
            cust_email = data.get("customer_email") or ""
            plan = data.get("items", {}).get("data", [{}])[0].get("price", {}).get("nickname") or data.get("plan", {}).get("nickname") or "unknown"
            # map customer email to user
            user = None
            if cust_email:
                user = await crud.get_user_by_email(cust_email)
            if user:
                await crud.create_subscription_record(user.id, sub_id, plan, status=data.get("status","active"))
        elif etype == "invoice.payment_succeeded":
            # record transaction and optionally add credits
            amount = (data.get("amount_paid") or data.get("total") or 0) / 100.0
            cust_email = data.get("customer_email") or ""
            user = None
            if cust_email:
                user = await crud.get_user_by_email(cust_email)
            if user:
                await crud.record_transaction(user.id, amount, currency=(data.get("currency") or "usd"))
                # grant credits based on amount (simple rule: $1 = 1 credit)
                credits = int(amount)
                if credits > 0:
                    await crud.add_credits_to_user(user.id, credits)
        elif etype == "customer.subscription.deleted":
            sub_id = data.get("id")
            await crud.update_subscription_status(sub_id, "canceled")
    except Exception:
        pass

    return {"status": "received", "type": etype}
