import React, { useRef, useState } from 'react'
import abi from '../contracts/contract.json'

import { ethers } from 'ethers';

const Contract = () => {

	function aleatorio() {
		const inferior = 1; 
		const superior = 12;
		var numPosibilidades = superior - inferior;
		var aleatorio = Math.random() * (numPosibilidades + 1);
		aleatorio = Math.floor(aleatorio);
		return inferior + aleatorio;
	}

	const CONTRACT_ADDRESS = "0xC1C03F8bBd74c42c6A5480066C5230Ea7ABa9D57";
	const ABI = abi;
	const [amount, setAmount] = useState(2)

	const checkContract = async (e) => {
		try {
			e.preventDefault();
			let id = [];
			let contract_address = CONTRACT_ADDRESS;
			let abi = JSON.parse(JSON.stringify((ABI)))
			const provider = new ethers.providers.Web3Provider(ethereum)
			const signer = provider.getSigner()
			const contract = new ethers.Contract(contract_address, abi, signer);
			const gasPrice = await provider.getFeeData()
			let price = await contract.price();
			for(let i = 0; i < amount; i++){
				id.push(aleatorio());
			}
			let finalAmount = (BigInt(price) * BigInt(amount));
			
			const tx = await contract.mintBatch(id,{value: finalAmount, gasPrice: gasPrice.gasPrice });
			if(tx){
				await tx.wait();
				alert("Transaction complete")
				console.log("success")
			}
		} catch (err) {
			console.log(err);
		}
	};

	const renderContainer = () => (
		<div className="flex flex-col items-center justify-center ">
			<img src="/fondo_landing_logo.png" alt="logo" className='w-[50%]' />
			<form onSubmit={(e) => checkContract(e)}>
				<div className='flex mt-2 text-4xl justify-center gap-2'>
					<button type='button' onClick={() => setAmount(prev => prev > 1 && prev - 1)} className='text-right'> - </button>
					<input readOnly type="number" className='w-24 border items-center text-center' value={amount} />
					<button type='button' onClick={() => setAmount(prev => prev + 1)}> + </button>
				</div>
				<button className="my-2 px-2 py-1 border rounded-xl bg-black text-white hover:bg-white hover:text-black" type="submit">
					MINT PRICE IS 0.1 ETH X 2 STAMPS
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