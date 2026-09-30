import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { protect } from "@/lib/auth";
import { saveImage } from "@/lib/uploadImages";

// претвора текст разделен со запирки во низа
function parseList(value) {
  if (!value) return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

// PUT /api/profile
export async function PUT(request) {
  try {
    const user = await protect(request);

    if (!user) {
      return Response.json(
        { message: "Не сте најавени" },
        { status: 401 }
      );
    }

    await connectDB();

    const currentUser = await User.findById(user._id);

    if (!currentUser) {
      return Response.json(
        { message: "Корисникот не е пронајден" },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    // Ги земаме податоците од formData
    const name = formData.get("name");
    const surname = formData.get("surname");
    const bio = formData.get("bio");
    const location = formData.get("location");

    // Ги ажурираме податоците
    if (name !== null) {
      currentUser.name = name.toString().trim();
    }

    if (surname !== null) {
      currentUser.surname = surname.toString().trim();
    }

    if (bio !== null) {
      currentUser.bio = bio.toString().trim();
    }

    if (location !== null) {
      currentUser.location = location.toString().trim();
    }

    // Skills и interests
    const skills = formData.get("skills");
    const interests = formData.get("interests");

    if (skills !== null) {
      currentUser.skills = parseList(skills.toString());
    }

    if (interests !== null) {
      currentUser.interests = parseList(interests.toString());
    }

    // Профилна слика
    const profileImage = formData.get("profileImage");

    if (profileImage && profileImage.size > 0) {
      currentUser.profileImage = await saveImage(profileImage);
    }

    // Ги зачувуваме промените
    await currentUser.save();

    // Го земаме ажурираниот корисник
    const updatedUser = await User.findById(user._id)
      .select("-password")
      .populate(
        "followers",
        "name surname profileImage role"
      )
      .populate(
        "following",
        "name surname profileImage role"
      );

    return Response.json(
      { user: updatedUser },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: error.status || 500 }
    );
  }
}