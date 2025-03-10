'use client'
import { useState, useEffect } from 'react'
import { Scale, Interval } from 'tonal'

const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const degrees = [
  '1P',
  '2m',
  '2M',
  '3m',
  '3M',
  '4P',
  '5d',
  '5P',
  '6m',
  '6M',
  '7m',
  '7M',
]
const degreeNames = [
  'Tonic',
  'Minor 2nd/b9th',
  'Major 2nd/9th',
  'Minor 3/#9',
  'Major 3/10',
  'Perfect 4/11',
  'Tritone/Diminished 5th/#11',
  'Perfect 5',
  'Minor 6/b13',
  'Major 6th/13th',
  'Dominate 7',
  'Major 7',
]

export default function Home() {
  const [selectedKey, setSelectedKey] = useState('C')
  const [currentKey, setCurrentKey] = useState('')
  const [currentDegree, setCurrentDegree] = useState<number | string>('')
  const [correctNote, setCorrectNote] = useState('')
  const [options, setOptions] = useState([])
  const [message, setMessage] = useState('Select the correct note!')
  const [showNext, setShowNext] = useState(false)
  const [usedDegrees, setUsedDegrees] = useState<number[]>([])
  const [currentDegreeName, setCurrentDegreeName] = useState('')

  useEffect(() => {
    generateQuestion()
  }, [selectedKey])

  function generateQuestion() {
    let availableDegrees = degrees.filter((d) => {
      return !usedDegrees.includes(d)
    })

    const randomDegree =
      availableDegrees[Math.floor(Math.random() * availableDegrees.length)]
    const semitones = Interval.get(randomDegree).semitones // Get semitone value

    if (availableDegrees.length === 0) {
      setUsedDegrees([])
      availableDegrees = [...degrees]
    }
    setUsedDegrees((prev) => [...prev, semitones]) // Store semitones
    setCurrentDegree(semitones) // Store semitone for calculations

    const myNub = Interval.get(randomDegree).semitones
    const myDegreeName = degreeNames[myNub]
    setCurrentDegreeName(myDegreeName) // Store interval name for display

    const scaleNotes = Scale.get(`${selectedKey.split(' ')[0]} chromatic`).notes
    const correct = scaleNotes[semitones] || 'Unknown'
    const sortedOptions = [...scaleNotes]

    function sortOptions(array: any) {
      return array
    }

    setCurrentKey(selectedKey)
    setCorrectNote(correct)
    setOptions(sortedOptions)
    setMessage('Select the correct note!')
    setShowNext(false)
  }

  function handleChoice(selection) {
    if (selection === correctNote) {
      setMessage(`✅ Correct! The answer is ${correctNote}`)
    } else {
      setMessage(`❌ Wrong! The correct answer is ${correctNote}`)
    }
    setShowNext(true)
  }

  function handleNextQuestion() {
    generateQuestion()
  }

  useEffect(() => {
    if (currentDegree === 1) {
      setCurrentDegree(Interval.get('2m').semitones)
      setCurrentDegreeName('minor 2nd/b9th')
    } else if (currentDegree === 2) {
      setCurrentDegree(Interval.get('2M').semitones)
      setCurrentDegreeName('Major 2nd/9th')
    } else if (currentDegree === 3) {
      setCurrentDegree(Interval.get('3m').semitones)
      setCurrentDegree('minor 3/#9')
    } else if (currentDegree === 4) {
      setCurrentDegree(Interval.get('3M').semitones)
      setCurrentDegreeName('Major 3/10')
    } else if (currentDegree === 5) {
      setCurrentDegree(Interval.get('4P').semitones)
      setCurrentDegreeName('Perfect 4/11')
    } else if (currentDegree === 6) {
      setCurrentDegree(Interval.get('5d').semitones)
      setCurrentDegreeName('Tritone/Diminished 5th/#11')
    } else if (currentDegree === 7) {
      setCurrentDegree(Interval.get('5P').semitones)
      setCurrentDegreeName('Perfect 5')
    } else if (currentDegree === 8) {
      setCurrentDegree(Interval.get('6m').semitones)
      setCurrentDegreeName('minor 6/b13')
    } else if (currentDegree === 9) {
      setCurrentDegree(Interval.get('6M').semitones)
      setCurrentDegreeName('Major 6th/13th')
    } else if (currentDegree === 10) {
      setCurrentDegree(Interval.get('7m').semitones)
      setCurrentDegreeName('Dominate 7')
    } else if (currentDegree === 11) {
      setCurrentDegree(Interval.get('7M').semitones)
      setCurrentDegreeName('Major 7')
    } else if (currentDegree === 0) {
      setCurrentDegree(Interval.get('1P').semitones)
      setCurrentDegreeName('Tonic')
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold">Scale Degree Quiz</h1>
      <p className="text-lg mt-4">Choose A Key</p>
      <select
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        value={selectedKey}
        onChange={(e) => {
          setSelectedKey(e.target.value)
        }}
      >
        {keys.map((key, index) => (
          <option key={index} value={key}>
            {key}
          </option>
        ))}
      </select>
      <p className="text-lg mt-2">
        What is the {currentDegreeName} degree of {currentKey}?
      </p>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {options.map((option, index) => (
          <button
            key={index}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-800 rounded-lg"
            onClick={() => handleChoice(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <p className="mt-6 text-xl font-semibold">{message}</p>
      {showNext && (
        <button
          className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-800 rounded-lg"
          onClick={handleNextQuestion}
        >
          Next Question
        </button>
      )}
    </div>
  )
}
