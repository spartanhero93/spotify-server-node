const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
} = require('graphql')
// const axios = require('axios')

const WaifusArr = [
  { name: 'Isla', age: undefined, isWaifu: true },
  { name: 'Taiga', age: 21, isWaifu: true },
  { name: 'Kirino', age: 18, isWaifu: false },
  { name: 'Ayase', age: 23, isWaifu: true },
  { name: 'Inori', age: 18, isWaifu: true },
  { name: 'Shiori', age: 17, isWaifu: true },
  { name: 'Rem', age: 18, isWaifu: true },
]

const Waifus = new GraphQLObjectType({
  name: 'Waifu',
  fields: () => ({
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    isWaifu: { type: GraphQLBoolean },
  }),
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    waifus: {
      type: new GraphQLList(Waifus),
      resolve(parent, args) {
        return WaifusArr
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
})
