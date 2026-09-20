import Stripe from "stripe";
import connectDB from "@/lib/mongodb";
import Course from "@/models/Course";
import Tutoring from "@/models/Tutoring";
import { protect } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const user = await protect(request);

    if (!user) {
      return Response.json(
        { message: "Не сте најавени" },
        { status: 401 }
      );
    }

    const { itemId, type } = await request.json();

    if (!itemId || !type) {
      return Response.json(
        { message: "Недостасуваат податоци" },
        { status: 400 }
      );
    }

    await connectDB();

    let item;

    // COURSE
    if (type === "course") {
      item = await Course.findById(itemId);
    }

    // TUTORING
    if (type === "tutoring") {
      item = await Tutoring.findById(itemId);
    }

    if (!item) {
      return Response.json(
        { message: "Не е пронајдено" },
        { status: 404 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "eur",

            product_data: {
              name: item.title,
            },

            unit_amount: Math.round(item.price * 100),
          },

          quantity: 1,
        },
      ],

      success_url:
        "http://localhost:3000/payment/success",

      cancel_url:
        "http://localhost:3000/payment/cancel",
    });

    return Response.json(
      {
        url: session.url,
      },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}