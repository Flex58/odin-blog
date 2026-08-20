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
  });
  return data;
};
