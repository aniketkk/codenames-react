export function searchInResponse(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].value === nameKey) {
            return i;
        }
    }
    return -1;
}

export function search(nameKey, prop, ret_prop, myArray2D){
    for (let i=0; i < myArray2D.length; i++) {
        for(let j = 0 ; j < myArray2D[i].length; j++){
            if (myArray2D[i][j][prop] === nameKey) {
                return myArray2D[i][j][ret_prop];
            }
        }

    }
    return -1;
}

export function getColor(word, myArray, selectedWords){
    let x = search(word.value, 'value','color', myArray)
    let className = 'card';
    if(x === 'RED' && word.guessed){
        className = 'card card-set-red';
    }else if(x === 'BLUE' && word.guessed){
        className = 'card card-set-blue';
    }else if(x === 'VILLAGER' && word.guessed){
        className = 'card card-set-villager';
    }else if(x === 'BLACK' && word.guessed){
        className = 'card card-set-black ';
    }else if(selectedWords.indexOf(word.value) !== -1){
        className = 'card card-selected';
    }
    return className;
}

export function getColorMaster(word, myArray){
    let x = search(word.value, 'value','color', myArray)
    let className = 'card';
    if(x === 'RED'){
        className = 'card card-set-red';
    }else if(x === 'BLUE'){
        className = 'card card-set-blue';
    }else if(x === 'VILLAGER'){
        className = 'card card-set-villager';
    }else if(x === 'BLACK'){
        className = 'card card-set-black ';
    }
    return className;
}