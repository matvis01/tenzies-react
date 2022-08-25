import React from "react"
import Die from "./Die"
import { nanoid } from "nanoid"

export default function App() {
	const [dice, setDice] = React.useState(allNewDice())
	const [gameWon, setGameWon] = React.useState(false)
	const [score, setScore] = React.useState(0)
	const [bestScore, setBestScore] = React.useState(
		JSON.parse(localStorage.getItem("bestScore")) || 0
	)

	React.useEffect(() => {
		const allHeld = dice.every((die) => die.isHeld)
		const firstValue = dice[0].value
		const allSameValue = dice.every(
			(die) => die.value === firstValue
		)
		if (allHeld && allSameValue) {
			setGameWon(true)
			if (bestScore === 0 || bestScore > score) {
				setBestScore(score)
				localStorage.setItem(
					"bestScore",
					JSON.stringify(bestScore)
				)
			}
		}
	}, [dice])

	function generateNewDie() {
		return {
			value: Math.ceil(Math.random() * 6),
			isHeld: false,
			id: nanoid(),
		}
	}

	function allNewDice() {
		const newDice = []
		for (let i = 0; i < 10; i++) {
			newDice.push(generateNewDie())
		}
		return newDice
	}

	function rollDice() {
		if (!gameWon) {
			setScore((prev) => prev + 1)
			setDice((oldDice) =>
				oldDice.map((die) => {
					return die.isHeld
						? die
						: generateNewDie()
				})
			)
		} else {
			setGameWon(false)
			setScore(0)
			setDice(allNewDice())
		}
	}

	function holdDice(id) {
		setDice((oldDice) =>
			oldDice.map((die) => {
				return die.id === id
					? {
							...die,
							isHeld: !die.isHeld,
					  }
					: die
			})
		)
	}

	const diceElements = dice.map((die) => (
		<Die
			key={die.id}
			value={die.value}
			isHeld={die.isHeld}
			holdDice={() => holdDice(die.id)}
		/>
	))

	return (
		<main>
			<h1 className="title">Tenzies</h1>
			<p className="instructions">
				Roll until all dice are the same. Click each die
				to freeze it at its current value between rolls.
			</p>
			<div className="scores">
				<h2>
					{gameWon
						? "Your score: "
						: "Your rolls: "}{" "}
					{score}
				</h2>
				<h2>Best Score: {bestScore}</h2>
			</div>
			<div className="dice-container">{diceElements}</div>
			<button className="roll-dice" onClick={rollDice}>
				{gameWon ? "New Game" : "Roll"}
			</button>
		</main>
	)
}
