const { prisma } = require("./prisma.js");

exports.getUserById = async (id) => {
  const data = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
  return data;
};

exports.getUserByEmail = async (email) => {
  const data = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return data;
};

exports.createUser = async (email, name, password) => {
  const data = await prisma.user.create({
    data: {
      email,
      name,
      password,
    },
    omit: {
      password: true,
    },
  });
  return data;
};

exports.createRefreshToken = async (userId, expiryDate) => {
  const data = await prisma.refreshToken.create({
    data: {
      userId,
      expiryDate,
    },
  });
  return data;
};

exports.getRefreshToken = async (token) => {
  const data = await prisma.refreshToken.findUnique({
    where: {
      token,
    },
    include: {
      user: true,
    },
  });
  return data;
};

exports.deleteRefreshToken = async (token) => {
  const data = await prisma.refreshToken.delete({
    where: {
      token,
    },
  });
  return data;
};

exports.updateAuthor = async (id, author) => {
  const data = await prisma.user.update({
    where: {
      id,
    },
    data: {
      author,
    },
  });
  return data;
};

exports.getPosts = async () => {
  const data = await prisma.posts.findMany();
  return data;
};

exports.createPost = async (data, authorId) => {
  const post = await prisma.posts.create({
    data: {
      title: data.title,
      text: data.content,
      published: data.published,
      authorId,
      upload: Date.now(),
    },
  });
  return post;
};

exports.updatePost = async (postId, data, authorId) => {
  const post = await prisma.posts.update({
    where: {
      postId,
      authorId,
    },
    data: {
      title: data.title,
      text: data.text,
      published: data.published,
    },
  });
  return post;
};

exports.deletePost = async (id) => {
  const data = await prisma.posts.delete({
    where: {
      id,
    },
  });
  return data;
};

exports.getSpecificPost = async (id) => {
  const data = await prisma.posts.findUnique({
    where: {
      id,
    },
  });
  return data;
};
