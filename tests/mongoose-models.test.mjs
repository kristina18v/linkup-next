import assert from "node:assert/strict";
import { describe, it } from "node:test";
import mongoose from "mongoose";

import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Message from "../models/Message.js";
import Post from "../models/Post.js";

const userId = () => new mongoose.Types.ObjectId();

describe("Post model", () => {
  it("input with author and padded content validates; expected trimmed content and default type", () => {
    const post = new Post({
      author: userId(),
      content: "  Need project feedback  ",
      tags: ["  react  ", "nextjs"],
    });

    const error = post.validateSync();

    assert.equal(error, undefined);
    assert.equal(post.content, "Need project feedback");
    assert.equal(post.type, "general");
    assert.deepEqual(post.tags, ["react", "nextjs"]);
    assert.deepEqual(post.images, []);
  });

  it("input with unsupported type fails; expected enum validation error for type", () => {
    const post = new Post({
      author: userId(),
      content: "Looking for a mentor",
      type: "unsupported",
    });

    const error = post.validateSync();

    assert.ok(error);
    assert.equal(error.errors.type.kind, "enum");
  });
});

describe("Course model", () => {
  it("input with required fields validates; expected defaults for level, status, language, and certificate", () => {
    const course = new Course({
      title: "  Intro to JavaScript  ",
      description: "  Basics and exercises  ",
      instructor: userId(),
      category: "programming",
      format: "online",
      price: 0,
      duration: "4 weeks",
    });

    const error = course.validateSync();

    assert.equal(error, undefined);
    assert.equal(course.title, "Intro to JavaScript");
    assert.equal(course.description, "Basics and exercises");
    assert.equal(course.level, "beginner");
    assert.equal(course.status, "active");
    assert.equal(course.language, "\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0441\u043a\u0438");
    assert.equal(course.certificateAvailable, false);
  });

  it("input with negative price fails; expected min validation error for price", () => {
    const course = new Course({
      title: "Design Basics",
      description: "Practical course",
      instructor: userId(),
      category: "design",
      format: "physical",
      price: -1,
      duration: "2 days",
    });

    const error = course.validateSync();

    assert.ok(error);
    assert.equal(error.errors.price.kind, "min");
  });
});

describe("Message model", () => {
  it("input with sender, receiver, and padded content validates; expected trimmed content and unread default", () => {
    const message = new Message({
      sender: userId(),
      receiver: userId(),
      content: "  Hello there  ",
    });

    const error = message.validateSync();

    assert.equal(error, undefined);
    assert.equal(message.content, "Hello there");
    assert.equal(message.isRead, false);
  });

  it("input without content fails; expected required validation error for content", () => {
    const message = new Message({
      sender: userId(),
      receiver: userId(),
    });

    const error = message.validateSync();

    assert.ok(error);
    assert.equal(error.errors.content.kind, "required");
  });
});

describe("Enrollment model", () => {
  it("input with user and course validates; expected pending status and empty date defaults", () => {
    const enrollment = new Enrollment({
      user: userId(),
      course: userId(),
      motivation: "  I want structured practice  ",
    });

    const error = enrollment.validateSync();

    assert.equal(error, undefined);
    assert.equal(enrollment.motivation, "I want structured practice");
    assert.equal(enrollment.status, "pending");
    assert.equal(enrollment.enrolledAt, null);
    assert.equal(enrollment.completedAt, null);
  });

  it("schema has unique user-course index; expected one enrollment per user per course rule", () => {
    const indexes = Enrollment.schema.indexes();

    assert.ok(
      indexes.some(
        ([fields, options]) =>
          fields.user === 1 &&
          fields.course === 1 &&
          options.unique === true
      )
    );
  });

  it("input with unsupported status fails; expected enum validation error for status", () => {
    const enrollment = new Enrollment({
      user: userId(),
      course: userId(),
      status: "waiting-list",
    });

    const error = enrollment.validateSync();

    assert.ok(error);
    assert.equal(error.errors.status.kind, "enum");
  });
});
