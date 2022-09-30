const graphql = require("graphql");
const _ = require("lodash");

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
} = graphql;

// dummy data
var books = [
	{ name: "Name of the Wind", genre: "Fantasy", id: "1", authorId: "1" },
	{ name: "The Final Empire", genre: "Fantasy", id: "2", authorId: "2" },
	{ name: "The Final Empire", genre: "Fantasy", id: "3", authorId: "2" },
	{ name: "The new Earth", genre: "Sci-Fi", id: "4", authorId: "3" },
	{ name: "The Long Moon", genre: "Sci-Fi", id: "5", authorId: "3" },
	{ name: "The short Pluto", genre: "Sci-Fi", id: "6", authorId: "3" },
];

var authors = [
	{ name: "Brendan Shaw", age: 102, id: "1" },
	{ name: "Mohamed Li", age: 32, id: "2" },
	{ name: "Yu Yang", age: 21, id: "3" },
];

const BookType = new GraphQLObjectType({
	name: "Book",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		author: {
			type: AuthorType,
			resolve(parent, args) {
				return _.find(authors, { id: parent.authorId });
			},
		},
	}),
});

// const EmoticonsType = new GraphQLObjectType({
//     name : "Emoticons",
//     fields: () => ({

//     })
// })
// const LinksType = new GraphQLObjectType({
//     name : "Links",
//     fields: () => ({

//     })
// })''

const AuthorType = new GraphQLObjectType({
	name: "Author",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				return _.filter(books, { authorId: parent.id });
			},
		},
	}),
});

const MentionType = new GraphQLObjectType({
	name: "Mentions",
	fields: () => ({
		mentions: { type: new GraphQLList(GraphQLString) },
	}),
});

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		book: {
			type: BookType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				//code to get code from db /other source
				return _.find(books, { id: args.id });
			},
		},
		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return _.find(authors, { id: args.id });
			},
		},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				return books;
			},
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent, args) {
				return authors;
			},
		},
		records: {
			type: new GraphQLList(GraphQLString),
			args: { message: { type: GraphQLString } },
			resolve(parent, args) {
				console.log(
					"mentions",
					args.message.match(/@\w+/g).map((x) => x.substr(1))
				);
				return args.message.match(/@\w+/g).map((x) => x.substr(1));
			},
		},
	},
});

module.exports = new graphql.GraphQLSchema({
	query: RootQuery,
});
