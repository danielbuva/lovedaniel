import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import abi from './utils/HeartPortal.json';
import heartPortal from './utils/HeartPortal.json';
import contractABI from './utils/HeartPortal.json';

const App = () => {
	const [user, setUser] = useState('');
	const [affection, setAffection] = useState('');
	const [allHearts, setAllHearts] = useState([]);
	const [message, setMessage] = useState('');
	const [text, setText] = useState([]);
	const [toggle, setToggle] = useState(false);

	const contractAddress = '0x3eBdB89Fe949C70d0Fc57b0D81F9E37518e476B3';
	const contractABI = abi.abi;

	useEffect(() => {
		checkIfWalletIsConnected();
	}, []);

	useEffect(() => {
		let heartPortalContract;

		const onNewHeart = (from, timestamp, message) => {
			console.log('NewHeart', from, timestamp, message);
			setAllHearts(prevState => [
				...prevState,
				{
					address: from,
					timestamp: new Date(timestamp * 1000),
					message: message
				}
			]);
		};
		if (window.ethereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();

			heartPortalContract = new ethers.Contract(
				contractAddress,
				contractABI,
				signer
			);
			heartPortalContract.on('NewHeart', onNewHeart);
		}

		return () => {
			if (heartPortalContract) {
				heartPortalContract.off('NewHeart', onNewHeart);
			}
		};
	}, []);

	const checkIfWalletIsConnected = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				console.log('make sure u have metamask ＞︿＜');
				return;
			} else {
				console.log('we have the ethereum object (づ￣ 3￣)づ', ethereum);
			}

			const accounts = await ethereum.request({ method: 'eth_accounts' });

			if (accounts.length !== 0) {
				const account = accounts[0];
				console.log('found an authorized account  (｡･∀･)ﾉﾞ:', account);
				setUser(account);
			} else {
				console.log('no authorized account found （＞人＜；）');
			}
		} catch (error) {
			console.log(error);
		}
	};

	const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				alert(`      get MetaMask! ⊙﹏⊙∥
      (ｏ・_・)ノ”(ノ_<、)`);
				return;
			}

			const accounts = await ethereum.request({
				method: 'eth_requestAccounts'
			});

			console.log('connected (‾◡‾)', accounts[0]);
			setUser(accounts[0]);
		} catch (error) {
			console.log(error);
		}
	};

	const heart = async () => {
		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const heartPortalContract = new ethers.Contract(
					contractAddress,
					contractABI,
					signer
				);

				let count = await heartPortalContract.getTotalHearts();
				console.log('retrieved total heart count...', count.toNumber());

				setAffection(`${(count = await heartPortalContract.getTotalHearts())}`); //cheap way to count hearts

				const heartTxn = await heartPortalContract.heart(message, {
					gasLimit: 300000
				});
				console.log('mining...', heartTxn.hash);
				await heartTxn.wait();
				console.log('Mined -- ', heartTxn.hash);

				count = await heartPortalContract.getTotalHearts();
				console.log('retrieved total heart count...', count.toNumber());
			} else {
				console.log("ethereum object doesn't exist ＞︿＜");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getAllHearts = async () => {
		try {
			const { ethereum } = window;
			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const heartPortalContract = new ethers.Contract(
					contractAddress,
					contractABI,
					signer
				);

				const hearts = await heartPortalContract.getAllHearts();

				const heartsCleaned = hearts.map(heart => {
					return {
						address: heart.lover,
						timestamp: new Date(heart.timestamp * 1000),
						message: heart.message
					};
				});

				setAllHearts(heartsCleaned);
			} else {
				console.log("Ethereum object doesn't exist!");
			}
		} catch (error) {
			console.log(error);
		}
	};

	function Harvest() {
		return (
			<p className={!toggle ? 'harvest' : 'harvestDark'}>
				hearts harvested: &nbsp; {affection} &nbsp; 🎔 ～
			</p>
		);
	}

	function addText() {
		setText([...text, addText]);
		setText('');
	}

	const colorChange = () => {
		setToggle(!toggle);
	};

	return (
		<>
			<header className={!toggle ? 'App-header' : 'App-headerDark'}>
				<div className={!toggle ? 'me' : 'meDark'}>ლ( •̀ ω ́• ლ)</div>
				<p className={!toggle ? 'message' : 'messageDark'}>love me</p>
				<p className={!toggle ? 'now' : 'nowDark'}>(now)</p>
				<p className={!toggle ? 'sign' : 'signDark'}>by dani</p>
				<div className="toggleContainer">
					<label className="switch">
						<input
							type="checkbox"
							id="checkbox"
							value={false}
							onChange={colorChange}
							className="checkbox"
						/>
						<span className="slider" />
					</label>
				</div>
				{user ? (
					<textarea
						className={!toggle ? 'textArea' : 'textAreaDark'}
						required
						type="text"
						value={message}
						placeholder="～ ♡ ～"
						onChange={e => {
							setMessage(e.target.value);
						}}
					/>
				) : null}

				<button
					className={!toggle ? 'heartButton' : 'heartButtonDark'}
					onClick={() => {
						heart();
						addText();
					}}
				>
					～ ♥ ～
				</button>
				<Harvest className={!toggle ? 'harvest' : 'harvestDark'} />
				{!user && (
					<button
						className={!toggle ? 'connectWallet' : 'connectWalletDark'}
						onClick={connectWallet}
					>
						{' '}
						♡*:.｡ connect wallet ｡.:*♡
					</button>
				)}
				{allHearts.map((heart, index) => {
					return (
						<div key={index} style={{}} className={!toggle ? 'userContainer' : 'userContainerDark'}>
							<div className={!toggle ? 'comments' : 'commentsDark'}>note: {heart.message}</div>
							<div className={!toggle ? 'address' : 'addressDark'}>lover: {heart.address}</div>
							<div className={!toggle ? 'time' : 'timeDark'}>timestamp: {heart.timestamp.toString()}</div>
						</div>
					);
				})}
			</header>
		</>
	);
};
export default App;