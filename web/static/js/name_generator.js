const adjectives = [
  'adaptable', 'adventurous', 'affable', 'affectionate', 'agreeable', 'ambitious', 'amiable', 'amicable', 'amusing', 'brave', 'bright', 'calm', 'careful', 'charming', 'communicative', 'compassionate ', 'conscientious', 'considerate', 'convivial', 'courageous', 'courteous', 'creative', 'decisive', 'determined', 'diligent', 'diplomatic', 'discreet', 'dynamic', 'easygoing', 'emotional', 'energetic', 'enthusiastic', 'exuberant', 'faithful', 'fearless', 'forceful', 'frank', 'friendly', 'funny', 'generous', 'gentle', 'good', 'gregarious', 'helpful', 'honest', 'humorous', 'imaginative', 'impartial', 'independent', 'intellectual', 'intelligent', 'intuitive', 'inventive', 'kind', 'loving', 'loyal', 'modest', 'neat', 'nice', 'optimistic', 'passionate', 'patient', 'persistent ', 'pioneering', 'philosophical', 'placid', 'plucky', 'polite', 'powerful', 'practical', 'quiet', 'rational', 'reliable', 'reserved', 'resourceful', 'romantic', 'sensible', 'sensitive', 'shy', 'sincere', 'sociable', 'straightforward', 'sympathetic', 'thoughtful', 'tidy', 'tough', 'unassuming', 'understanding', 'versatile', 'warmhearted', 'willing', 'witty']

const animals = [
  'alligator', 'ant', 'bear', 'bee', 'bird', 'camel', 'cat', 'cheetah', 'chicken', 'chimpanzee', 'cow', 'crocodile', 'deer', 'dog', 'dolphin', 'duck', 'eagle', 'elephant', 'fish', 'fly', 'fox', 'frog', 'giraffe', 'goat', 'goldfish', 'hamster', 'hippopotamus', 'horse', 'kangaroo', 'kitten', 'lion', 'lobster', 'monkey', 'octopus', 'owl', 'panda', 'pig', 'puppy', 'rabbit', 'rat', 'scorpion', 'seal', 'shark', 'sheep', 'snail', 'snake', 'spider', 'squirrel', 'tiger', 'turtle', 'wolf', 'zebra']

function generateName(){
  const adjectivesLength = adjectives.length
  const animalsLength = animals.length

  const randomAdjective = adjectives[numInRange(adjectivesLength)]
  const randomAnimal = animals[numInRange(animalsLength)]

  return `${randomAdjective} ${randomAnimal}`
}

function numInRange(to) {
  return Math.floor(Math.random()*(to))
}

export default generateName
