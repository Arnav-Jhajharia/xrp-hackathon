import {User,Score,Loan} from './models.js';
import xrpl from 'xrpl';
const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233'); // testnet

export const resolvers = {
  Query:{
    user:(_, {id}) => User.findById(id),
    users:()     => User.find(),
    loan:(_, {id})=> Loan.findById(id)
  },
  Mutation:{
    async linkPlaid(_,{userId,publicToken}){
      // hit Plaid exchange_token, store item_id
      return User.findByIdAndUpdate(userId,{plaidId:'sandboxItem123'},{new:true});
    },
    async rescore(_,{userId}){
      const features = await collectFeatures(userId);      // your script
      const {pd,limit,shapTop} = await mlScore(features);  // your model
      return Score.create({userId,pd,limit,shapTop});
    },
    async requestLoan(_,{userId,amount}){
      const borrower = await User.findById(userId);
      // XRPL: create LoanSet ↓
      const tx = {/*…XLS-66d tx…*/};
      await client.submitAndWait(tx);
      return Loan.create({borrowerId:userId,principal:amount,
                          status:'DRAWN',xrplLoanId:tx.hash});
    },
    async repayLoan(_,{loanId,amount}){
      const loan = await Loan.findById(loanId);
      // XRPL LoanPay tx
      await client.submitAndWait({/*...*/});
      loan.status='REPAID'; return loan.save();
    }
  },
  User:{
    scores:(u)=>Score.find({userId:u.id}),
    loans:(u)=>Loan.find({borrowerId:u.id})
  }
};
