import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { getDatabaseConnection } from "../../lib/database";
import { User } from "../../entities/User";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - No session found" },
        { status: 401 }
      );
    }

    const connection = await getDatabaseConnection();
    if (!connection.isInitialized) {
      await connection.initialize();
    }

    const userRepo = connection.getRepository(User);
    const user = await userRepo.findOne({
      where: { email: session.user.email },
      select: [
        "id",
        "name",
        "email",
        "phone",
        "image",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error("GET /api/user error:", error);
    const errorMessage =
    error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? errorMessage : null,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - No session found" },
        { status: 401 }
      );
    }

    const updateData = await request.json();
    const { name, phone, image } = updateData;

    // Validate input
    if (!name && !phone && !image) {
      return NextResponse.json(
        { error: "At least one field (name, phone, or image) must be provided" },
        { status: 400 }
      );
    }

    const connection = await getDatabaseConnection();
    if (!connection.isInitialized) {
      await connection.initialize();
    }

    const userRepo = connection.getRepository(User);
    
    // First check if user exists
    const existingUser = await userRepo.findOne({
      where: { email: session.user.email }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updatePayload: Partial<User> = {
      updatedAt: new Date()
    };

    if (name !== undefined) updatePayload.name = name;
    if (phone !== undefined) updatePayload.phone = phone;
    if (image !== undefined) updatePayload.image = image;

    // Perform update
    await userRepo.update(
      { email: session.user.email },
      updatePayload
    );

    // Fetch updated user
    const updatedUser = await userRepo.findOne({
      where: { email: session.user.email },
      select: ["id", "name", "email", "phone", "image", "updatedAt"],
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to fetch updated user data" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      image: updatedUser.image,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error) {
    console.error("PUT /api/user error:", error);
    const errorMessage =
    error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? errorMessage : null
      },
      { status: 500 }
    );
  }
}