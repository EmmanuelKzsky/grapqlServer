import {ApolloServer, UserInputError, gql} from 'apollo-server';

const defaultReports = {
    "base": "EUR",
    "success": true,
    "timeseries": true,
    "rates": [
      {
        "ANG": 2.021479,
        "SVC": 9.964469,
        "CAD": 1.535436,
        "date": "2019-01-16"
      },
      {
        "ANG": 2.009764,
        "SVC": 9.907593,
        "CAD": 1.542879,
        "date": "2019-01-17"
      },
      {
        "ANG": 2.019129,
        "SVC": 9.953775,
        "CAD": 1.507594,
        "date": "2019-01-18"
      },
      {
        "ANG": 2.019129,
        "SVC": 9.953775,
        "CAD": 1.507594,
        "date": "2019-01-19"
      },
    ]
  }

const typeDefs = gql`
    type ReportData {
        base: String
        success: Boolean
        timeseries: Boolean
        rates: [Rate]
    }
    type Rate {
      ANG: String!
      SVC: String!
      CAD: String!
      date: String!
    }

    type Query {
        reportRatesCount: Int!
        getReport: ReportData!
        searchReportByDate: Rate
    }

    type Mutation {
      addReport(
        ANG: String!
        SVC: String!
        CAD: String!
        date: String!
      ): Rate
    }
`
const resolvers = {
  Query: {
    reportRatesCount: () => defaultReports.rates.length,
    getReport: () => defaultReports,
    searchReportByDate: (root, args) => {
      const {date} = args
      return defaultReports.rates.find(rate => rate.date === date)
    }
  },
  Mutation: {
    addReport:(root, args) => {
      if(defaultReports.rates.find(rate => args.date === rate.date)){
        throw new UserInputError('Report already added', {
          invalidArgs: args.date
        })
      }
      const report = { ...args}
      defaultReports.rates.push(report)
      return report
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({url}) => {
  console.log(`Server ready at ${url}`)
})