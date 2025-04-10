'use client'
import { useState, useEffect } from 'react'
import { Scale, Interval } from 'tonal'

const keys = [
  'C',
  'C#',
  'Db',
  'D',
  'D#',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
  'Ab',
  'A',
  'A#',
  'Bb',
  'B',
]
const degreesChromatic = [
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
const degreesMajor = ['1P', '2M', '3M', '4P', '5P', '6M', '7M']
const degreesMinor = ['1P', '2M', '3m', '4P', '5P', '6m', '7m']

const modes = ['major', 'minor', 'chromatic']

export default function Home() {
  const [selectedKey, setSelectedKey] = useState('C')
  const [selectedMode, setSelectedMode] = useState('major')
  const [currentKey, setCurrentKey] = useState('')
  const [correctNote, setCorrectNote] = useState('')
  const [options, setOptions] = useState<string[]>([])

  const [message, setMessage] = useState('Select the correct note!')
  const [showNext, setShowNext] = useState(false)
  const [usedDegrees, setUsedDegrees] = useState<number[]>([]) // makes sure degree arent repeated
  const [completedCombos, setCompletedCombos] = useState<string[]>([])
  const [currentDegreeName, setCurrentDegreeName] = useState('')

  useEffect(() => {
    generateQuestion()
  }, [selectedKey, selectedMode])

  let availableDegrees
  function generateQuestion() {
    //converts degree name into its intervals
    if (selectedMode === 'major') {
      availableDegrees = degreesMajor.filter((d) => {
        const semitoneValue = Interval.get(d).semitones // ✅ Convert interval to semitones
        return !usedDegrees.includes(semitoneValue)
      })
    } else if (selectedMode === 'minor') {
      availableDegrees = degreesMinor.filter((d) => {
        const semitoneValue = Interval.get(d).semitones // ✅ Convert interval to semitones
        return semitoneValue
      })
    } else {
      availableDegrees = degreesChromatic.filter((d) => {
        const semitoneValue = Interval.get(d).semitones // ✅ Convert interval to semitones
        return !usedDegrees.includes(semitoneValue)
      })
    }
    console.log('availableDegrees: ', availableDegrees)

    const randomDegree =
      availableDegrees[Math.floor(Math.random() * availableDegrees.length)]
    console.log('random degree: ', randomDegree)

    const semitones = Interval.get(randomDegree).semitones // ✅ Now it's properly declared

    setUsedDegrees((prev) => {
      console.log(...prev)
      console.log([...prev, semitones])
      return [...prev, semitones]
    }) // ✅ Store semitones as numbers

    if (availableDegrees.length === 0) {
      setUsedDegrees([])

      // ✅ Mark the current key as completed
      const combo = `${selectedKey} ${selectedMode}`
      setCompletedCombos((prev) => [...new Set([...prev, combo])])

      return // Exit early — no more questions for this key
    }

    let scaleNotes
    if (selectedMode === 'major') {
      scaleNotes = Scale.get(`${selectedKey.split(' ')[0]} major`).notes
    } else if (selectedMode === 'minor') {
      scaleNotes = Scale.get(`${selectedKey.split(' ')[0]} minor`).notes
    } else {
      scaleNotes = Scale.get(`${selectedKey.split(' ')[0]} chromatic`).notes
    }

    const currentInterval = Interval.fromSemitones(semitones)

    let correct: string | undefined
    switch (currentInterval) {
      case '1P':
        correct = scaleNotes[0]
        setCurrentDegreeName('Tonic')
        break
      case '2m':
        correct = scaleNotes[1]
        setCurrentDegreeName('Major 2nd/9th')
        break
      case '2M':
        correct = scaleNotes[1]
        setCurrentDegreeName('Major 2nd/9th')
        break
      case '3M':
        correct = scaleNotes[2]
        setCurrentDegreeName('Major 3rd/10th')
        break
      case '3m':
        correct = scaleNotes[2]
        setCurrentDegreeName('Minor 3rd/#9th')
        break
      case '4P':
        correct = scaleNotes[3]
        setCurrentDegreeName('Perfect 4th/11th')
        break
      case '5d':
        correct = scaleNotes[4] // not right just need place filler
        setCurrentDegreeName('Tritone/#11')
        break
      case '5P':
        correct = scaleNotes[4]
        setCurrentDegreeName('Perfect 5th')
        break
      case '6m':
        correct = scaleNotes[5]
        setCurrentDegreeName('Minor 6/b13')
        break
      case '6M':
        correct = scaleNotes[5]
        setCurrentDegreeName('Major 6th/13th')
        break
      case '7m':
        correct = scaleNotes[6]
        setCurrentDegreeName('Dominate 7')
        break
      case '7M':
        correct = scaleNotes[6]
        setCurrentDegreeName('Major 7')
        break
      default:
        console.log('Just another day.')
    }

    const randomizeScaleNotes = scaleNotes.sort(() => Math.random() - 0.5)
    setCurrentKey(selectedKey)
    setCorrectNote(correct ?? '')
    setOptions(randomizeScaleNotes)
    setMessage('Select the correct note!')
    setShowNext(false)
  }

  function handleChoice(selection: string) {
    if (selection === correctNote) {
      setMessage(`✅ Correct! The answer is ${correctNote}`)
    } else {
      setMessage(`❌ Wrong! The correct answer is ${correctNote}`)
    }
    setShowNext(true)
    // Automatically move to the next question after 1 second
    setTimeout(() => {
      generateQuestion()
    }, 1000)
  }

  function handleNextQuestion() {
    generateQuestion()
  }

  const keyModeCombos = keys.flatMap((key) =>
    modes.map((mode) => `${key} ${mode}`)
  )

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold">Scale Degree Quiz</h1>
      <p className="text-lg mt-4">Choose A Key & Scale</p>
      <select
        value={`${selectedKey} ${selectedMode}`}
        onChange={(e) => {
          const [key, mode] = e.target.value.split(' ')
          setSelectedKey(key)
          setSelectedMode(mode)
        }}
      >
        {keyModeCombos.map((keyModeCombo, index) => {
          const [key, mode] = keyModeCombo.split(' ')
          const combo = `${key} ${mode}`
          const isDisabled = completedCombos.includes(keyModeCombo)

          return (
            <option key={index} value={combo} disabled={isDisabled}>
              {isDisabled ? `${combo} (Done)` : combo}
            </option>
          )
        })}
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
