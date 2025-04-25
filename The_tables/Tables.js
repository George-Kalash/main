// make a cycle that takes a value from an array as id from elements. Replace the current attributes

let SHEET_ID = '1VHwKv2r_jDoGLT6nWFqCI8k-ZGmKNEJqDkkbo1wVygQ';
let SHEET_TITLE = 'residents';
let SHEET_RANGE = 'A1:Z1000';

let FULL_URL = ('https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?sheet=' + SHEET_TITLE + '&reange=' + SHEET_RANGE);
 
fetch(FULL_URL)
.then(res => res.text())
.then(rep => {
    // data is the array of values
    const data = JSON.parse(rep.substr(47).slice(0,-2));
    console.log(data)
    let grid = document.getElementById('res_grid');
    let attributes = document.getElementById('attributes')
    let tables = document.getElementById('tables');

    let grid2 = document.getElementById('res_grid2');
    let len = data.table.rows.length;
    let attributes_len = data.table.cols.length

    // console.log(c_len);
    // the name
    console.log(data.table.rows[0].c[0].v);
    console.log(data.table.cols[0].label)
    //counters
    let residents = [];
    let cold = [];
    let half = [];
    let noIce = [];
    let milky = [];
    let smallMilkAmount = [];
    let appetizers = [];
    let mugAmount = [];
    let cranCount = [];
    let TPresent = [];
    let variables = [];
    // basic indicators of attibutes of a person
    let Present = document.createElement('div');
    Present.id = "present";
    Present.className = "list_value";
    
    let coldWater = document.createElement('div');
    let ColdWater = document.createElement('div');

    coldWater.id = "cold";
    coldWater.className = "list_value";
    ColdWater.id = "indicator_cold";
    ColdWater.className = 'indicator';

    let halfCold = document.createElement('div');
    let HalfCold = document.createElement('div');

    halfCold.id = "half_cold";
    halfCold.className = "list_value";
    HalfCold.id = 'indicator_half';
    HalfCold.className = 'indicator';

    let NoIce = document.createElement('div');
    let noice = document.createElement('div');
    
    noice.id = 'indicator_noice';
    noice.className = 'indicator';
    NoIce.id = "no_ice";
    NoIce.className = "list_value";
    
    let Milk = document.createElement('div');
    let milk_indicator = document.createElement('div');
    
    milk_indicator.id = 'indicator_milk'
    milk_indicator.className = 'indicator'
    Milk.id = "milk";
    Milk.className = "list_value";

    let smallMilk = document.createElement('div');
    let small_milk_indicator = document.createElement('div');
    
    small_milk_indicator.id = 'indicator_milk_small'
    small_milk_indicator.className = 'indicator'
    smallMilk.id = "smallMilk";
    smallMilk.className = "list_value";
    
    let Mug = document.createElement('div');
    let Mug_indicator = document.createElement('div');
    
    Mug_indicator.id = 'indicator_mug'
    Mug_indicator.className = 'indicator'
    Mug.id = "Mug";
    Mug.className = "list_value";

    let V8 = document.createElement('div');
    let V8_indicator = document.createElement('div');
    
    V8_indicator.id = 'indicator_V8'
    V8_indicator.className = 'indicator'
    V8.id = "V8";
    V8.className = "list_value";

    let Cran = document.createElement('div');
    let Cran_indicator = document.createElement('div');
    
    Cran_indicator.id = 'indicator_Cran'
    Cran_indicator.className = 'indicator'
    Cran.id = "Cran";
    Cran.className = "list_value";
    // creates an array of properties (variables) of the residents
    for(i=0;i<attributes_len;i++){
        let j = data.table.cols[i].label.split(' ')
        variables.push(j[0])
    }
    console.log(variables);

    // for (i=0;i<variables.length;i++){
    //     class Residen {
    //         constructor(){};
    //         addResident()
    //     };

    // }

    class Resident {
        constructor(name, present, tableR, appetizer, water, carafe, cup, mug, small_milk, milk, cran_juice) {
            this.name = name;
            this.present = present;
            this.tableR = tableR;
            this.appetizer = appetizer;
            this.water = water;
            this.carafe = carafe;
            this.cup = cup;
            this.mug = mug;
            this.small_milk = small_milk;
            this.milk = milk;
            this.cran_juice = cran_juice;
        }
    }

    let maxTableNumber = 0; // Initialize the maximum table number
    for (let i = 0; i < len; i++) {
        // map(cell => cell.v) function used to create an array of values of v
        let personData = data.table.rows[i].c.map(cell => cell.v)
        console.log(personData);
        let [name, present, tableR, appetizer, water, carafe, cup, mug, small_milk, milk, cran_juice] = personData;
        let person = new Resident(name, present, tableR, appetizer, water, carafe, cup, mug, small_milk, milk, cran_juice);
        residents.push(person);

        

            let p = person.present.toLowerCase();
            // let m = person.milk.toUpper();
            if (p == "p"){
                
                if (person.water.toLowerCase() == "cold")  cold.push(person);
                else if (person.water.toLowerCase() == "half") half.push(person);
                else if (person.water.toLowerCase() == "no ice") noIce.push(person);
                if (person.milk.toLowerCase() == "y" || person.milk == "yes") milky.push(person);
                if (person.appetizer.toLowerCase() == "v8" || person.milk == "no") appetizers.push(person);
                if (person.cran_juice.toLowerCase() == "y" || person.milk == "yes") cranCount.push(person);
                if (person.small_milk.toLowerCase() == "y" || person.small_milk == "yes") smallMilkAmount.push(person);
                if (person.mug.toLowerCase() == "y" || person.mug == "yes") mugAmount.push(person);
                TPresent.push(person);

                // Check if the current table number is greater than the current maximum
                if (person.tableR > maxTableNumber) { 
                // Update the maximum table number
                    maxTableNumber = person.tableR; 
                }
            } 
    };
    console.log("The biggest table number is: " + maxTableNumber);
    // creates tables
    for (let i = 0; i < maxTableNumber; i++) {
        let j = i;
        let table_number = document.createElement('div');
        let table_ = document.createElement('div');
        let table_box = document.createElement('div')
        j++
        table_box.className = 'tbl_box'
        table_.id = 'table_' + i;
        table_number.className = 'table_number';
        table_.className = ("table");
        tables.append(table_box);
        table_box.append(table_number);
        table_box.append(table_);
        table_number.innerHTML = ("<strong>Table "+ j);
        
        // gets the residents' names and the tables and places all of residents to assigned tables
        for (let k = 0; k < len; k++) {
            if (residents[k].tableR == j) {
                if (residents[k].present.toLowerCase() == "p") {
                    let table_person = document.createElement('div');
                    let table_person_name = document.createElement('div')
                    let table_person_first_name = residents[k].name.split(' ');
                    table_person.className = 'person';
                    table_.append(table_person);
                    table_person.append(table_person_name)
                    table_person_name.innerHTML = table_person_first_name[0];

                    //appends icons
                    if (residents[k].water.toLowerCase() == 'cold') {
                        let coldWaterClone = ColdWater.cloneNode(true);
                        table_person.append(coldWaterClone);
                    }

                    if (residents[k].water.toLowerCase() == 'half') {
                        let HalfColdClone = HalfCold.cloneNode(true);
                        table_person.append(HalfColdClone);
                    }

                    if (residents[k].water.toLowerCase() == 'no ice' || residents[k].water.toLowerCase() == 'no') {
                        let noiceClone = noice.cloneNode(true);
                        table_person.append(noiceClone);
                    }

                    if (residents[k].milk.toLowerCase() == 'y' || residents[k].milk.toLowerCase() == 'yes') {
                        let milk_indicatorClone = milk_indicator.cloneNode(true);
                        table_person.append(milk_indicatorClone);
                    }

                    if (residents[k].small_milk.toLowerCase() == 'y' || residents[k].small_milk.toLowerCase() == 'yes') {
                        let smallMilk_indicatorClone = small_milk_indicator.cloneNode(true);
                        table_person.append(smallMilk_indicatorClone);
                    }

                    if (residents[k].mug.toLowerCase() == 'y' || residents[k].mug.toLowerCase() == 'yes') {
                        let Mug_indicatorClone = Mug_indicator.cloneNode(true);
                        table_person.append(Mug_indicatorClone);
                    }
                    if (residents[k].appetizer.toLowerCase() == 'v8' || residents[k].appetizer.toLowerCase() == 'no') {
                        let V8_indicatorClone = V8_indicator.cloneNode(true);
                        table_person.append(V8_indicatorClone);
                    }

                    if (residents[k].cran_juice.toLowerCase() == 'y' || residents[k].appetizer.toLowerCase() == 'yes') {
                        let Cran_indicatorClone = Cran_indicator.cloneNode(true);
                        table_person.append(Cran_indicatorClone);
                    }
                }
            }
        }
        
        // remove the table 
        let count = document.getElementById('table_' + i).childElementCount;
        if (count <1){
            table_box.remove(table_)
        }

        j++;
    }

    //addition of basic info to #attributes
    attributes.append(Present);
    Present.innerHTML = ("<strong>Present: "+TPresent.length);   
    attributes.append(coldWater);
    coldWater.innerHTML = ("Water with ice: <strong> "+cold.length);
    coldWater.prepend(ColdWater);
    console.log(ColdWater)
    attributes.append(halfCold);
    halfCold.innerHTML = ("Half cold half hot water: <strong>"+half.length);
    halfCold.prepend(HalfCold);
    
    attributes.append(NoIce);
    NoIce.innerHTML = ("water, no ice: <strong>"+noIce.length);  
    NoIce.prepend(noice);
    
    attributes.append(Milk);
    Milk.innerHTML = (`Milk: <strong>${milky.length}`);
    Milk.prepend(milk_indicator)
    
    attributes.append(smallMilk);
    smallMilk.innerHTML = (`Small jug of milk: <strong>${smallMilkAmount.length}`);
    smallMilk.prepend(small_milk_indicator)
    
    attributes.append(Mug);
    Mug.innerHTML = (`Mugs: <strong>${mugAmount.length}`);
    Mug.prepend(Mug_indicator)

    attributes.append(V8);
    V8.innerHTML = (`V8 juice: <strong>${appetizers.length}`);
    V8.prepend(V8_indicator)
    
    attributes.append(Cran);
    Cran.innerHTML = (`Cranberry juice: <strong>${cranCount.length}`);
    Cran.prepend(Cran_indicator)

    let ifs = document.createElement('div')
    attributes.append (ifs);
    ifs.innerHTML = `<strong>If table's missing, no people are sitting there.`
    ifs.style.margin = "5px"

    // let overallGlasses = document.createElement('div');
    // let glassesRequired = Number(appetizers.length) + Number(cranCount.length) + Number(milky.lengt) + Number(noIce.length) + Number(half.length) + Number(cold.length);
    // attributes.append(overallGlasses);
    // console.log(glassesRequired)
    // overallGlasses.innerHTML = `Glasses required: ${glassesRequired}`
    // overallGlasses.style.margin = "5px"
    
    console.log("length of the data list: "+data.table.rows.length);
    console.log("ppl present: "+TPresent.length);
    
    
});

