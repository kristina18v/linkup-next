import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { protect } from "@/lib/auth";

// PUT /api/users/[id]/follow
export async function PUT(request, { params }) {
  try {
    const user = await protect(request);

    if (!user) {
      return Response.json(
        { message: "Не сте најавени" },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params;

    // Не можеш самиот себе да се следиш
    if (id === user._id.toString()) {
      return Response.json(
        { message: "Не можете да се следите сами себе" },
        { status: 400 }
      );
    }

    // Корисникот што сакаме да го следиме
    const userToFollow = await User.findById(id);

    if (!userToFollow) {
      return Response.json(
        { message: "Корисникот не е пронајден" },
        { status: 404 }
      );
    }

    // Најавениот корисник
    const currentUser = await User.findById(user._id);

    // Проверка дали веќе го следиме
    const alreadyFollowing = currentUser.following.some(
      (userId) => userId.toString() === id
    );

    if (alreadyFollowing) {
      // UNFOLLOW

      currentUser.following = currentUser.following.filter(
        (userId) => userId.toString() !== id
      );

      userToFollow.followers = userToFollow.followers.filter(
        (userId) =>
          userId.toString() !== user._id.toString()
      );
    } else {
      // FOLLOW

      currentUser.following.push(id);
      userToFollow.followers.push(user._id);

      // Notification
      await Notification.create({
        user: userToFollow._id,
        sender: user._id,
        type: "follow",
        message: `${user.name} започна да ве следи.`,
        link: `/users/${user._id}`,
      });
    }

    await currentUser.save();
    await userToFollow.save();

    return Response.json(
      {
        following: !alreadyFollowing,
        followersCount: userToFollow.followers.length,
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