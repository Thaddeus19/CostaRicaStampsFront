import React, { useRef, useState, useEffect } from 'react'
import abi from '../contracts/contract.json'
import dotenv from "dotenv";
import { ethers } from 'ethers';

dotenv.config();

const Contract = () => {

	function aleatorio() {
		const inferior = 1;
		const superior = 12;
		var numPosibilidades = superior - inferior;
		var aleatorio = Math.random() * (numPosibilidades + 1);
		aleatorio = Math.floor(aleatorio);
		return inferior + aleatorio;
	}

	const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
	const ABI = abi;
	const [amount, setAmount] = useState(1);
	const [price, setPrice] = useState(0);
	const [error, setError] = useState();

	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();

	useEffect(() => {
		const fetchPrice = async () => {
			try {
				let contract_address = CONTRACT_ADDRESS;
				let abi = JSON.parse(JSON.stringify((ABI)))
				const contract = new ethers.Contract(contract_address, abi, signer);
				const rawPrice = await contract.price();

				setPrice(rawPrice);
			} catch (err) {
				console.error('Error fetching price:', err);
			}
		};

		fetchPrice();
	}, []);

	const checkContract = async (e) => {
		let totalBalance = [];
		try {
			e.preventDefault();
			let id = [];
			let contract_address = CONTRACT_ADDRESS;
			let abi = JSON.parse(JSON.stringify((ABI)))

			const contract = new ethers.Contract(contract_address, abi, signer);
			const gasPrice = await provider.getFeeData()

			for (let i = 0; i < 12; i++) {
				let balance = await contract.balanceOf(signer.getAddress(), i);
				if (balance != 0) {
					totalBalance.push(balance);
				}
			}
			console.log("totalBalance", totalBalance);

			if (totalBalance.length != 0) {
				 setError('You can only mint 1 NFT');
			} else {
			for (let i = 0; i < amount; i++) {
				id.push(aleatorio());
			}
			let finalAmount = (BigInt(price) * BigInt(amount));

			const tx = await contract.mintBatch(id, { value: finalAmount, gasPrice: gasPrice.gasPrice, gasLimit: 22000000 });
			if (tx) {
				await tx.wait();
				alert("Transaction complete")
				console.log("success")
			}
		}
		} catch (err) {
			console.log(err);
		}
	};

	const renderContainer = () => (
		<div className="flex flex-col items-center justify-center ">
			<div className="p-4">
				{error && (
					<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
						⚠️ {error}
					</div>
				)}
				</div>
				<img src="/fondo_landing_logo.png" alt="logo" className='w-[50%]' />
				<form onSubmit={(e) => checkContract(e)}>
					<div className="flex mt-2 text-4xl justify-center gap-2">
						{/* <button
							type="button"
							onClick={() => setAmount((prev) => (prev > 1 ? prev - 1 : 1))}
							className="text-right"
						>
							-
						</button> */}

						<input
							readOnly
							type="number"
							className="w-24 border text-center"
							value={amount}
						/>

						{/* <button
							type="button"
							onClick={() => setAmount((prev) => prev + 1)}
						>
							+
						</button> */}
					</div>

					<div className="mt-4 text-center">
						<h1 className="text-2xl font-semibold">Price: {parseFloat(ethers.utils.formatEther(price))} ETH</h1>
					</div>
					<div className="flex justify-center">
					<button
						className="my-4 px-4 py-2 border rounded-xl bg-black text-white hover:bg-white hover:text-black transition"
						type="submit"
					>
						MINT
					</button>
					</div>
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