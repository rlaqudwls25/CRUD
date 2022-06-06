const userResolver = {
  Query: {
    users: (parent, args, { db }) => Object.values(db.user),
    user: (parent, { id }, { db }) => db.user[id],
  },
}

export default userResolver
