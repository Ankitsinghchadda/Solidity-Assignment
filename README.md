Solidity Assignment:
Fork SushiSwap’s SushiBar contract and implement following featuresStaking:
Time lock after staking:
2 days - 0% can be unstaked
2-4 days - 25% can be unstaked
4-6 days - 50% can be unstaked
6-8 days - 75% can be unstaked
After 8 days - 100% can be unstaked.This will work like a high tax though.
0-2 days - locked
2-4 days - 75% tax
4-6 days - 50% tax
6-8 days - 25% tax
After 8 days, 0% tax.
The tokens received on tax will go back into rewards pool.
The tax will be applied on Sushi tokens.Recommend Tech Stack:
Hardhat, TypeScript, Mocha
![Screenshot (63)](https://user-images.githubusercontent.com/75713738/187493379-de3a3193-3a20-4b38-a440-61ab6eb224aa.png)
