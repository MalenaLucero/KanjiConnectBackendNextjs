interface Sense {
    english_definitions: string[],
    parts_of_speech: string[],
}

const jlptLevels = {
    range: [1, 2, 3, 4, 5, null],
    min: 1,
    max: 5,
    default: null,
    levelText: [
        { level: 1, jishoText: 'jlpt-n1'},
        { level: 2, jishoText: 'jlpt-n2'},
        { level: 3, jishoText: 'jlpt-n3'},
        { level: 4, jishoText: 'jlpt-n4'},
        { level: 5, jishoText: 'jlpt-n5'},
    ]
}

const jlptJishoTextToInteger = (jishoText: string): number | null => {
    const levelTextObj = jlptLevels.levelText.find(e => e.jishoText === jishoText);
    return levelTextObj ? levelTextObj.level : null;
}

const filterEnglishMeaning = (senses: Sense[]) => {
    const englishMeanings: string[] =  senses.map(e => 
        e.english_definitions.join(', ').toLowerCase()
    )
    const uniqueMeanings: string [] = Array.from(new Set(englishMeanings))
    return uniqueMeanings;
}

export default async (req: any, res: any) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', '*') // adjust in prod
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization'
    )
    
   try {
        const response = await fetch('https://jisho.org/api/v1/search/words?keyword=' + req.query.word)
            .then(res => res.json())
        res.json(response.data.map((e: any) => {
            let transitivity = null;
            if (e.senses[0].parts_of_speech.includes('Intransitive verb')) {
                transitivity = 'intransitive';
            } else if (e.senses[0].parts_of_speech.includes('Transitive verb')) {
                transitivity = 'transitive';
            }
            return {
                word: e.japanese[0].word,
                reading: e.japanese[0].reading,
                englishMeaning: filterEnglishMeaning(e.senses),
                jlpt: e.jlpt[0] ? jlptJishoTextToInteger(e.jlpt[0]) : null,
                transitivity: transitivity
            } 
        }))
    } catch (e) {
        console.error(e);
    }
}