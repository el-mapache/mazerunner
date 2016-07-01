'use strict';

const DATA = [{ id: 20090821, type: 'A', red: 25.6, green: 25.61, blue: 25.2 }, { id: 20090824, type: 'A', red: 25.64, green: 25.74, blue: 25.3 }, { id: 20090825, type: 'D', red: 25.5, green: 25.7, blue: 25.22 }, { id: 20090826, type: 'A', red: 25.32, green: 25.6425, blue: 25.14 }, { id: 20090827, type: 'A', red: 25.5, green: 25.57, blue: 25.2 }, { id: 20090828, type: 'T', red: 25.67, green: 26.05, blue: 25.6 }, { id: 20090831, type: 'A', red: 25.45, green: 25.74, blue: 25.3 }, { id: 20090901, type: 'H', red: 25.51, green: 26.33, blue: 25.4 }, { id: 20090902, type: 'A', red: 25.97, green: 25.97, blue: 24.9 }, { id: 20090903, type: 'J', red: 25.47, green: 25.54, blue: 2 }, { id: 20090904, type: 'A', red: 25.37, green: 25.92, blue: 25.1475 }, { id: 20090909, type: 'C', red: 26.31, green: 27.19, blue: 26.1 }, { id: 20090910, type: 'A', red: 27.08, green: 27.88, blue: 26.9 }, { id: 20090911, type: 'E', red: 27.88, green: 28.16, blue: 27.7 }, { id: 20090914, type: 'A', red: 27.86, green: 28.18, blue: 27.6 }, { id: 20090915, type: 'R', red: 28.01, green: 28.38, blue: 27.6 }, { id: 20090916, type: 'A', red: 28.33, green: 28.77, blue: 28.3 }, { id: 20090917, type: 'Y', red: 28.59, green: 28.82, blue: 28.17 }, { id: 20090918, type: 'H', red: 28.69, green: 28.73, blue: 27.8 }];

const CHROMOSOMES = [];

function seedChromosomes(data) {
    console.log('Seeding Chromosomes');
    let numberOfChromosomes = 10;
    while (numberOfChromosomes--) {
        CHROMOSOMES.push(createChromosome(data[0]));
    };
}

function createChromosome(row) {
    const chromosome = [];
    let numberOfGenes = parseInt(Math.random() * 10);
    console.log('Create Chromosome with ' + numberOfGenes + ' genes');
    let gene;
    while (numberOfGenes--) {
        gene = createGene(row);
        if (gene) chromosome.push(gene);
    }

    return chromosome;
}

function createGene(row) {
    console.log('Creating gene');
    const keys = Object.keys(row);
    const key = keys[parseInt(Math.random() * (keys.length - 1))];

    const value = row[key];

    if (typeof value === 'number' && key !== 'id') {
        const result = {
            key: key,
            min: Math.random() * 3 + 25,
            max: Math.random() * 3 + 25
        };

        return Object.assign({}, result, {
            min: result.min < result.max ? result.min : result.max,
            max: result.min <= result.max ? result.max : result.min
        });
    } else {
        return null;
    }
}

seedChromosomes(DATA);
console.log(CHROMOSOMES);
