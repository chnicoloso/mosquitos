class Mosquito {
    hasMated: boolean;
    dayMated: number | undefined;
    daysLived: number;
    constructor() {
        this.daysLived = 0;
        this.hasMated = false;
    }

    static mate(male: MaleMosquito, female: FemaleMosquito, day: number) {
        male.hasMated = true;
        female.hasMated = true;
        male.dayMated = day;
        female.dayMated = day;
    }
}

class FemaleMosquito extends Mosquito {
    sex = 'female';
    timesLayed: number;
    lastDayLayed: number | undefined;
    constructor() {
        super();
        this.timesLayed = 0;
        this.sex = 'female';
    }
    isPregnant(day: number) {
        if (!this.hasMated) {
            return false;
        }
        // Ready to lay if it has been three days since she mated 
        // Or if it has been three days since she last layed.
        const readyToLay = (day - this.dayMated! === 3) || (day - this.lastDayLayed! === 3);
        return readyToLay;
    }
    get isDead() {
        // Females die after laying eggs for the third time.
        return this.timesLayed === 3;
    }
}

class MaleMosquito extends Mosquito {
    sex = 'male';
    get isDead() {
        // Males live a maximum of 5 days after mating.
        return this.hasMated && ((this.daysLived - this.dayMated!) > 5);
    }
}

class Egg {
    daysWaiting = 0;
    get isReady() {
        return this.daysWaiting === 12;
    }
}


interface Population {
    males: MaleMosquito[];
    females: FemaleMosquito[];
}
/**
 * Return the mosquito population present in a location after a given amount of time, starting from an initial population.
 * @param {Population} [initialPopulation] The amount of adult mosquitos initially in the location.
 * @param {Number} [days] The amount of days the population will run through its lifecycle.
 * @return {Population} The final population of adult mosquitos present in the location.
 * 
 * Mosquito life cycle:
 * 1) A mosquito egg takes 1-2 days to hatch. Once hatched, a mosquito reaches reproductive age in 10 days.
 * 2) Mosquitos take 1-2 days to find a mate.
 * 3) Male mosquitos live 3-5 more days after mating.
 * 4) Female mosquitos lay a up to 100 eggs every third day, three times before dying.
 * 
 * Mosquito facts:
 * 1) Mosquitos mate only once.
 * 2) Only female mosquitos bite and suck for blood.
 * 3) Female/Male mosquito birth ratio is 1:1.
 * 4) Male mosquitos stay within a mile of hatching location, Female mosquitos may travel many miles in their lifetime.
 * 
 * Assumptions:
 * 1) Ideal conditions: No predators, no mutations, no external factors.
 * 2) Females stay in the initial location.
 * 3) We will merge larvae and egg stages into the egg stage.
 */

export function getMosquitoPopulation(initialPopulation: Population, days: number) {
    const population: Population = Object.assign({}, initialPopulation);
    let eggs: Egg[] = [];
    // Simulate each day.
    for (let day = 0; day < days; day++) {
        const availableMales = population.males.filter(male => !male.hasMated);
        const availableFemales = population.females.filter(female => !female.hasMated);
        // Single males go out looking for females.
        (availableMales && availableFemales) && availableMales.forEach(male => {
            // Each finds an available female and mates.
            const female = availableFemales.shift();
            female && Mosquito.mate(male, female, day);
        });
        // Females that are ready to lay eggs, do so.
        const pregnantFemales = population.females.filter(female => female.isPregnant(day));
        const newEggs: Egg[] = [];
        pregnantFemales.forEach(female => {
            // Each female lays 100 eggs per laying.
            for (let i = 0; i < 100; i++) {
                newEggs.push(new Egg());
            }
            female.timesLayed++;
            female.lastDayLayed = day;
        });
        // Hatch ready eggs.
        eggs.forEach(egg => {
            if (egg.isReady) {
                // 50:50 chance of egg being born male or female.
                const maleOrFemale = ['male', 'female'];
                const bornMosquito = maleOrFemale[Math.floor(Math.random()*maleOrFemale.length)];
                // Add the born mosquito to the population.
                if (bornMosquito === 'male') {
                    population.males.push(new MaleMosquito());
                } else {
                    population.females.push(new FemaleMosquito());
                }
            }
        });
        // Remove hatched eggs from queue.
        eggs = eggs.filter(egg => !egg.isReady);
        // Remove dead mosquitos from the population.
        population.males = population.males.filter(male => !male.isDead);
        population.females = population.females.filter(female => !female.isDead);
        // Add one day of life to all remaining mosquitos.
        population.males.forEach(male => (male.daysLived++));
        population.females.forEach(female => (female.daysLived++));
        // Add one day of waiting to all remaining eggs.
        eggs.forEach(egg => (egg.daysWaiting++));
        // Add new eggs to queue.
        eggs = eggs.concat(newEggs);
    }
    return population;

}

export function sampleGetMosquitoPopulation() {
    // Start with one female, one male.
    const initialPopulation: Population = { 
        males: [new MaleMosquito()],
        females: [new FemaleMosquito()]
    };
    // Get mosquito population after 30 days.
    return getMosquitoPopulation(initialPopulation, 30);
}