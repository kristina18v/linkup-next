import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";



//go zena jwt od .env.local 
function getJWTSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not set in .env.local");
  }

  return secret;
}

// Kreiranje na JWT token, se koristi koga userot e najaven i se kreira token primer {id: 1234}

export function createToken(userID) {
  return jwt.sign( 
    { id: userID },
    getJWTSecret(),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );
}

// Verifikacija na token dali e vistinski i dali se uste vazi
export function verifyToken(token) {
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, getJWTSecret());
  } catch {
    return null;
  }
}

// Ja povikuvame vo API ruti koi sakame da gi zastitime
export async function protect(request) {
  const authorization = request.headers.get("authorization");

  let token;

  if (authorization?.startsWith("Bearer ")) {
    token = authorization.split(" ")[1];
  }

  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get("jwt")?.value;
  }

  const decoded = verifyToken(token); // go proveruva tokenot 

  if (!decoded) {
    return null;
  }

  await connectDB();

  const user = await User.findById(decoded.id); // go zemame idto od tokenot i go barame korisnikot vo bazata na podatoci

  return user;
}

// Ja povikuvame vo Server Component za da znaeme dali e najaven userot, // posledna proverka go zema jwt od cookie i go proveruva dali e validen
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  return verifyToken(token);
}