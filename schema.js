import {gql} from 'apollo-server-express';
export const typeDefs = gql`
  scalar Date

  type User  { id:ID! name:String email:String xrplAccount:String passportDid:String
               scores:[Score] loans:[Loan] }
  type Score { id:ID! pd:Float limit:Float shapTop:[String] updatedAt:Date }
  type Loan  { id:ID! principal:Float status:String xrplLoanId:String createdAt:Date }

  type Query {
    user(id:ID!):User
    users:[User]
    loan(id:ID!):Loan
  }

  type Mutation {
    linkPlaid(userId:ID!, publicToken:String!):User
    rescore(userId:ID!):Score
    requestLoan(userId:ID!, amount:Float!):Loan
    repayLoan(loanId:ID!, amount:Float!):Loan
  }
`;
