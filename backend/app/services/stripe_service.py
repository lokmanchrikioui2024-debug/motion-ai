import os
import stripe
from fastapi import HTTPException

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")


def create_checkout_session(customer_email: str, price_id: str, success_url: str, cancel_url: str):
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            line_items=[{"price": price_id, "quantity": 1}],
            customer_email=customer_email,
            success_url=success_url,
            cancel_url=cancel_url,
        )
        return session
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def create_portal_session(customer_id: str, return_url: str):
    try:
        session = stripe.billing_portal.Session.create(customer=customer_id, return_url=return_url)
        return session
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
