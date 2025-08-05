import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

import type Stripe from "stripe";

type SuccessPageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  // Extract session_id from search params, must be a string
    const params = searchParams ? await searchParams : undefined;

  const session_id =
    typeof params?.session_id === "string" ? params.session_id : undefined;

  if (!session_id) {
    throw new Error("Missing `session_id` in search params.");
  }

  // Initialize Supabase client
  const supabase = await createClient();

  // Retrieve the checkout session from Stripe with expanded details
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items.data.price.product", "payment_intent", "shipping"],
  });

  const {
    status,
    amount_total,
    currency,
    customer_details,
    payment_status,
    payment_intent,
    line_items,
    // shipping_details,
  } = session;

  // Redirect if session is still open (not completed or expired)
  if (status === "open") {
    redirect("/");
  }

  // Process completed session
  if (status === "complete") {
    // Get currently authenticated user from Supabase
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error fetching user:", userError);
      throw new Error("Failed to fetch authenticated user.");
    }

    // Helper to serialize Stripe Address objects into JSON-safe objects
    const addressToJson = (address: Stripe.Address | null | undefined) => {
      if (!address) return null;
      // Use JSON stringify/parse to deeply clone
      return JSON.parse(JSON.stringify(address));
    };

    // Prepare order data for insertion
    const orderData = {
      customer_id: user?.id ?? null,
      total_amount: amount_total ? amount_total / 100 : 0,
      currency,
      payment_status,
      billing_address: addressToJson(customer_details?.address),
    //   shipping_address: addressToJson(shipping?.address),
      payment_method:
        (payment_intent as Stripe.PaymentIntent)?.payment_method_types?.[0] ?? null,
      status: "completed",
    };

    // Insert order record
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error("Error inserting order:", orderError);
      throw new Error("Failed to save order details.");
    }

    // Insert order items if any
    if (order && line_items?.data) {
      const orderItemsData = line_items.data.map((item) => {
        const product = item.price?.product as Stripe.Product;
        return {
          order_id: order.id,
          product_id: product?.metadata?.supabase_product_id
            ? Number.parseInt(product.metadata.supabase_product_id)
            : null,
          quantity: item.quantity,
          unit_price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
          total_price: item.amount_total ? item.amount_total / 100 : 0,
        };
      });

      const { error: orderItemsError } = await supabase
        .from("order_items")
        .insert(orderItemsData);

      if (orderItemsError) {
        console.error("Error inserting order items:", orderItemsError);
        throw new Error("Failed to save order item details.");
      }
    }

    const customerEmail = customer_details?.email;

    // Return success JSX section (server component)
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to {customerEmail}. If
          you have any questions, please email{" "}
          <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    );
  }

  // Return null if status is anything else
  return null;
}