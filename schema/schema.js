const graphql = require("graphql");
const getUrlTitle = require("get-url-title");

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList } =
	graphql;

const GetUrlTitle = async (urltofetch) => {
	const response = await getUrlTitle(urltofetch);
	return response;
};

const LinkType = new GraphQLObjectType({
	name: "Links",
	fields: () => ({
		url: { type: GraphQLString },
		title: { type: GraphQLString },
	}),
});

const RecordType = new GraphQLObjectType({
	name: "Records",
	fields: () => ({
		mentions: { type: new GraphQLList(GraphQLString) },
		emoticons: { type: new GraphQLList(GraphQLString) },
		links: {
			type: new GraphQLList(LinkType),
		},
	}),
});

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		records: {
			type: RecordType,
			args: { message: { type: GraphQLString } },
			resolve(parent, args) {
				return {
					mentions: args.message.match(/@\w+/g)?.map((x) => x.substr(1)) || [],
					emoticons:
						args.message.match(/\(.*?\)/g)?.map((x) => x.replace(/[()]/g, "")) || [],
					links: [
						{
							url: args.message.match(/\bhttps?:\/\/\S+/gi)?.[0],
							title: GetUrlTitle(args.message.match(/\bhttps?:\/\/\S+/gi)?.[0]),
						},
					],
				};
			},
		},
	},
});

module.exports = new graphql.GraphQLSchema({
	query: RootQuery,
});
