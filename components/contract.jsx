import React, { useRef, useState } from 'react'
import abi from '../contracts/contract.json'

import { ethers } from 'ethers';

const Contract = () => {

	const CONTRACT_ADDRESS = "0x879c0991c94A65e57cD589e877fe56Af26F4E7A6";
	const ABI = abi;
	const [amount, setAmount] = useState(0)
	const id = process.env.NEXT_PUBLIC_ID

	const checkContract = async (e) => {
		try {
			e.preventDefault();

			let contract_address = CONTRACT_ADDRESS;
			let abi = JSON.parse(JSON.stringify((ABI)))
			const provider = new ethers.providers.Web3Provider(ethereum)
			const signer = provider.getSigner()
			console.log("chainid", provider.getNetwork());
			const contract = new ethers.Contract(contract_address, abi, signer);
			const gasPrice = await provider.getFeeData()
			let price = await contract.price();
			await contract.mint(id,amount,{value: price,gasPrice: gasPrice.gasPrice });
			console.log("success")
		} catch (err) {
			console.log(err);
		}
	};

	const renderContainer = () => (
		<div className="flex flex-col items-center justify-center ">
			<img src="/fondo_landing_logo.png" alt="logo" className='w-[50%]' />
			<form onSubmit={(e) => checkContract(e)}>
				<div className='flex mt-2 text-4xl justify-center gap-2'>
					<button type='button' onClick={() => setAmount(prev => prev > 0 && prev - 1)} className='text-right'> - </button>
					<input readOnly type="number" className='w-24 border items-center text-center' value={amount} />
					<button type='button' onClick={() => setAmount(prev => prev + 1)}> + </button>
				</div>
				<button className="my-2 px-2 py-1 border rounded-xl bg-black text-white hover:bg-white hover:text-black" type="submit">
					MINT PRICE IS 0.2 ETH X 2 STAMPS
				</button>
			</form>
		</div>
	);

	return (
		<div>
			{renderContainer()}
		</div>
	)
}

export default Contract