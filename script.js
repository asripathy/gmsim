var gmApp = angular.module('gmsim', []);

gmApp.controller('gmCtrl', function($scope) {

    $scope.year = 2017;
    /*---------------------------TEAM CODE-------------------------------*/
    //Lineup
    $scope.startingGuard;
    $scope.startingWing;
    $scope.startingFlex;
    $scope.startingForward;
    $scope.startingBig;
    $scope.sixthMan;

    $scope.updatedGuard;
    $scope.updatedWing;
    $scope.updatedFlex;
    $scope.updatedForward;
    $scope.updatedBig;
    $scope.updatedSixth;

    $scope.resetStatuses = function() {
        //Lineup Status Variables
        $scope.updatedGuard = false;
        $scope.updatedWing = false;
        $scope.updatedFlex = false;
        $scope.updatedForward = false;
        $scope.updatedBig = false;
        $scope.updatedSixth = false;
    }


    var playerTypes = ["Stud", "Role-player", "Role-player", "Role-player", "Role-player"];
    $scope.initializeTeam = function() {
        $scope.startingGuard = getDefaultPlayer("Guard", playerTypes.splice(Math.floor(Math.random() * playerTypes.length), 1)[0]);
        $scope.startingWing = getDefaultPlayer("Wing", playerTypes.splice(Math.floor(Math.random() * playerTypes.length), 1)[0]);
        $scope.startingForward = getDefaultPlayer("Forward", playerTypes.splice(Math.floor(Math.random() * playerTypes.length), 1)[0]);
        $scope.startingBig = getDefaultPlayer("Big", playerTypes.splice(Math.floor(Math.random() * playerTypes.length), 1)[0]);
        $scope.startingFlex = getDefaultPlayer(positions[Math.floor(Math.random() * 4)], playerTypes.splice(Math.floor(Math.random() * playerTypes.length), 1)[0]);
        $scope.sixthMan = getDefaultPlayer(positions[Math.floor(Math.random() * 4)], "Specialist");
    }

    $scope.insertPlayer = function(starter, toInsert, flexPossible) {
        var dupeStarter = {
            position: starter.position,
            name: starter.name,
            val: starter.val
        };
        if (toInsert.val > starter.val) {
            if (!flexPossible) {
                starter.type = toInsert.type;
                starter.val = toInsert.val;
                starter.name = toInsert.name;
                $scope.addToTeam(dupeStarter);
            }
            else {
                if ($scope.startingFlex.val < starter.val) {
                    temp = $scope.startingFlex;
                    $scope.startingFlex = toInsert;
                    $scope.updatedFlex = true;
                    $scope.addToTeam(temp);
                }
                else {
                    starter.type = toInsert.type;
                    starter.val = toInsert.val;
                    starter.name = toInsert.name;
                    $scope.addToTeam(dupeStarter);
                }
            }
            return true;
        }
        else if (flexPossible) {
            temp = $scope.startingFlex;
            $scope.startingFlex = toInsert;
            $scope.updatedFlex = true;
            $scope.addToTeam(temp);
            return true;
        }
        return false;
    }

    $scope.addToTeam = function(player) {
        console.log("trying to add to team mofo");
        console.log(player);
        var added = false;
        var flexPossible = false;
        if (player.val > $scope.startingFlex.val) {
            flexPossible = true;
        }
        if (player.position == "Guard") {
            added = $scope.insertPlayer($scope.startingGuard, player, flexPossible);
            if(added && !$scope.updatedFlex)
              $scope.updatedGuard = true;
        } else if (player.position == "Wing") {
            added = $scope.insertPlayer($scope.startingWing, player, flexPossible);
            if(added && !$scope.updatedFlex)
              $scope.updatedWing = true;
        } else if (player.position == "Forward") {
            added = $scope.insertPlayer($scope.startingForward, player, flexPossible);
            if(added && !$scope.updatedFlex)
              $scope.updatedForward = true;
        } else if (player.position == "Big") {
            added = $scope.insertPlayer($scope.startingBig, player, flexPossible);
            if(added && !$scope.updatedFlex)
              $scope.updatedBig = true;
        }
        if (!added) {
            if (player.val > $scope.sixthMan.val) {
                $scope.sixthMan = player;
                $scope.updatedSixth = true;
            }
        }
    }
    $scope.initializeTeam();
    $scope.resetStatuses();

    /*---------------------------DRAFT CODE-------------------------------*/
    //Draft Slot information
    $scope.draftSlot = 3;
    $scope.validSlot = true;

    //Information on players available and selected
    $scope.options = [0, 1, 2];
    $scope.playerOptions;
    $scope.selectedPlayer;

    //Information on state of draft
    $scope.draftComplete = false;
    $scope.draftActive = false;
    $scope.roundActive = false;

    // $scope.team = [];

    //Ensures valid slot offered
    $scope.validateSlot = function() {
        if ($scope.slotSelect.slotChoice.$valid)
            $scope.validSlot = true;
        else
            $scope.validSlot = false;
    }

    //Generates the available picks
    $scope.generatePicks = function(draftSlot) {
        $scope.resetStatuses();
        $scope.draftActive = true;
        $scope.roundActive = true;
        $scope.draftSlot = draftSlot;
        $scope.playerOptions = getPlayersAttributes($scope.draftSlot);
    }

    //Performs the actual selection
    $scope.markSelected = function(pick) {
        if ($scope.roundActive == true) {
            $scope.selectedPlayer = pick;
            $scope.addToTeam(pick);
            // $scope.team.push(pick);
            $scope.roundActive = false;
            if ($scope.draftSlot > 30) {
                $scope.draftComplete = true;
            }
        }
    }
    /*---------------------------END DRAFT CODE-------------------------------*/
});

/*---------------------------PLAYER ATTRIBUTES CODE-------------------------------*/
// TODO refactor player object names
var positions = ["Guard", "Wing", "Forward", "Big"];

function getPlayersAttributes(index) {
    arr = [];
    for (var i = 1; i <= 3; i++) {
        playerAttributes = {
            risk: Math.round(Math.random() * 50),
            upside: Math.round((90 / Math.pow(index, 0.15)) + (Math.random() * 10) - 1),
            position: positions[Math.floor(Math.random() * 4)],
            name: names[Math.floor(Math.random() * names.length)] + ' ' + names[Math.floor(Math.random() * names.length)]
        };
        playerAttributes.val = playerAttributes.upside - (0.25 * playerAttributes.risk);
        playerAttributes.type = getPlayerType(playerAttributes.val);
        arr.push(playerAttributes);
        // console.log(playerAttributes);
    }
    return arr;
}

function getPlayerType(val) {
    if (val >= 87)
        return "Superstar";
    else if (val >= 77)
        return "Star";
    else if (val >= 64)
        return "Stud";
    else if (val >= 52)
        return "Role-player";
    else if (val >= 45)
        return "Specialist";
    else
        return "Bust";
}

function getDefaultPlayer(playerPosition, playerType) {
    var value = 0;
    if (playerType == "Stud")
        value = 65;
    else if (playerType == "Role-player")
        value = 53;
    else if (playerType == "Specialist")
        value = 46;

    return {
        risk: 0,
        upside: value,
        val: value,
        type: playerType,
        position: playerPosition,
        name: names[Math.floor(Math.random() * names.length)] + ' ' + names[Math.floor(Math.random() * names.length)]
    }
}


var names = ['Abbott', 'Acevedo', 'Acosta', 'Adams', 'Adkins', 'Aguilar', 'Aguirre', 'Albert', 'Alexander', 'Alford', 'Allen', 'Allison', 'Alston', 'Alvarado', 'Alvarez', 'Anderson', 'Andrews', 'Anthony', 'Armstrong', 'Arnold', 'Ashley', 'Atkins', 'Atkinson', 'Austin', 'Avery', 'Avila', 'Ayala', 'Ayers', 'Bailey', 'Baird', 'Baker', 'Baldwin', 'Ball', 'Ballard', 'Banks', 'Barber', 'Barker', 'Barlow', 'Barnes', 'Barnett', 'Barr', 'Barrera', 'Barrett', 'Barron', 'Barry', 'Bartlett', 'Barton', 'Bass', 'Bates', 'Battle', 'Bauer', 'Baxter', 'Beach', 'Bean', 'Beard', 'Beasley', 'Beck', 'Becker', 'Bell', 'Bender', 'Benjamin', 'Bennett', 'Benson', 'Bentley', 'Benton', 'Berg', 'Berger', 'Bernard', 'Berry', 'Best', 'Bird', 'Bishop', 'Black', 'Blackburn', 'Blackwell', 'Blair', 'Blake', 'Blanchard', 'Blankenship', 'Blevins', 'Bolton', 'Bond', 'Bonner', 'Booker', 'Boone', 'Booth', 'Bowen', 'Bowers', 'Bowman', 'Boyd', 'Boyer', 'Boyle', 'Bradford', 'Bradley', 'Bradshaw', 'Brady', 'Branch', 'Bray', 'Brennan', 'Brewer', 'Bridges', 'Briggs', 'Bright', 'Britt', 'Brock', 'Brooks', 'Brown', 'Browning', 'Bruce', 'Bryan', 'Bryant', 'Buchanan', 'Buck', 'Buckley', 'Buckner', 'Bullock', 'Burch', 'Burgess', 'Burke', 'Burks', 'Burnett', 'Burns', 'Burris', 'Burt', 'Burton', 'Bush', 'Butler', 'Byers', 'Byrd', 'Cabrera', 'Cain', 'Calderon', 'Caldwell', 'Calhoun', 'Callahan', 'Camacho', 'Cameron', 'Campbell', 'Campos', 'Cannon', 'Cantrell', 'Cantu', 'Cardenas', 'Carey', 'Carlson', 'Carney', 'Carpenter', 'Carr', 'Carrillo', 'Carroll', 'Carson', 'Carter', 'Carver', 'Case', 'Casey', 'Cash', 'Castaneda', 'Castillo', 'Castro', 'Cervantes', 'Chambers', 'Chan', 'Chandler', 'Chaney', 'Chang', 'Chapman', 'Charles', 'Chase', 'Chavez', 'Chen', 'Cherry', 'Christensen', 'Christian', 'Church', 'Clark', 'Clarke', 'Clay', 'Clayton', 'Clements', 'Clemons', 'Cleveland', 'Cline', 'Cobb', 'Cochran', 'Coffey', 'Cohen', 'Cole', 'Coleman', 'Collier', 'Collins', 'Colon', 'Combs', 'Compton', 'Conley', 'Conner', 'Conrad', 'Contreras', 'Conway', 'Cook', 'Cooke', 'Cooley', 'Cooper', 'Copeland', 'Cortez', 'Cote', 'Cotton', 'Cox', 'Craft', 'Craig', 'Crane', 'Crawford', 'Crosby', 'Cross', 'Cruz', 'Cummings', 'Cunningham', 'Curry', 'Curtis', 'Dale', 'Dalton', 'Daniel', 'Daniels', 'Daugherty', 'Davenport', 'David', 'Davidson', 'Davis', 'Dawson', 'Day', 'Dean', 'Decker', 'Dejesus', 'Delacruz', 'Delaney', 'Deleon', 'Delgado', 'Dennis', 'Diaz', 'Dickerson', 'Dickson', 'Dillard', 'Dillon', 'Dixon', 'Dodson', 'Dominguez', 'Donaldson', 'Donovan', 'Dorsey', 'Dotson', 'Douglas', 'Downs', 'Doyle', 'Drake', 'Dudley', 'Duffy', 'Duke', 'Duncan', 'Dunlap', 'Dunn', 'Duran', 'Durham', 'Dyer', 'Eaton', 'Edwards', 'Elliott', 'Ellis', 'Ellison', 'Emerson', 'England', 'English', 'Erickson', 'Espinoza', 'Estes', 'Estrada', 'Evans', 'Everett', 'Ewing', 'Farley', 'Farmer', 'Farrell', 'Faulkner', 'Ferguson', 'Fernandez', 'Ferrell', 'Fields', 'Figueroa', 'Finch', 'Finley', 'Fischer', 'Fisher', 'Fitzgerald', 'Fitzpatrick', 'Fleming', 'Fletcher', 'Flores', 'Flowers', 'Floyd', 'Flynn', 'Foley', 'Forbes', 'Ford', 'Foreman', 'Foster', 'Fowler', 'Fox', 'Francis', 'Franco', 'Frank', 'Franklin', 'Franks', 'Frazier', 'Frederick', 'Freeman', 'French', 'Frost', 'Fry', 'Frye', 'Fuentes', 'Fuller', 'Fulton', 'Gaines', 'Gallagher', 'Gallegos', 'Galloway', 'Gamble', 'Garcia', 'Gardner', 'Garner', 'Garrett', 'Garrison', 'Garza', 'Gates', 'Gay', 'Gentry', 'George', 'Gibbs', 'Gibson', 'Gilbert', 'Giles', 'Gill', 'Gillespie', 'Gilliam', 'Gilmore', 'Glass', 'Glenn', 'Glover', 'Goff', 'Golden', 'Gomez', 'Gonzales', 'Gonzalez', 'Good', 'Goodman', 'Goodwin', 'Gordon', 'Gould', 'Graham', 'Grant', 'Graves', 'Gray', 'Green', 'Greene', 'Greer', 'Gregory', 'Griffin', 'Griffith', 'Grimes', 'Gross', 'Guerra', 'Guerrero', 'Guthrie', 'Gutierrez', 'Guy', 'Guzman', 'Hahn', 'Hale', 'Haley', 'Hall', 'Hamilton', 'Hammond', 'Hampton', 'Hancock', 'Haney', 'Hansen', 'Hanson', 'Hardin', 'Harding', 'Hardy', 'Harmon', 'Harper', 'Harrell', 'Harrington', 'Harris', 'Harrison', 'Hart', 'Hartman', 'Harvey', 'Hatfield', 'Hawkins', 'Hayden', 'Hayes', 'Haynes', 'Hays', 'Head', 'Heath', 'Hebert', 'Henderson', 'Hendricks', 'Hendrix', 'Henry', 'Hensley', 'Henson', 'Herman', 'Hernandez', 'Herrera', 'Herring', 'Hess', 'Hester', 'Hewitt', 'Hickman', 'Hicks', 'Higgins', 'Hill', 'Hines', 'Hinton', 'Hobbs', 'Hodge', 'Hodges', 'Hoffman', 'Hogan', 'Holcomb', 'Holden', 'Holder', 'Holland', 'Holloway', 'Holman', 'Holmes', 'Holt', 'Hood', 'Hooper', 'Hoover', 'Hopkins', 'Hopper', 'Horn', 'Horne', 'Horton', 'House', 'Houston', 'Howard', 'Howe', 'Howell', 'Hubbard', 'Huber', 'Hudson', 'Huff', 'Huffman', 'Hughes', 'Hull', 'Humphrey', 'Hunt', 'Hunter', 'Hurley', 'Hurst', 'Hutchinson', 'Hyde', 'Ingram', 'Irwin', 'Jackson', 'Jacobs', 'Jacobson', 'James', 'Jarvis', 'Jefferson', 'Jenkins', 'Jennings', 'Jensen', 'Jimenez', 'Johns', 'Johnson', 'Johnston', 'Jones', 'Jordan', 'Joseph', 'Joyce', 'Joyner', 'Juarez', 'Justice', 'Kane', 'Kaufman', 'Keith', 'Keller', 'Kelley', 'Kelly', 'Kemp', 'Kennedy', 'Kent', 'Kerr', 'Key', 'Kidd', 'Kim', 'King', 'Kinney', 'Kirby', 'Kirk', 'Kirkland', 'Klein', 'Kline', 'Knapp', 'Knight', 'Knowles', 'Knox', 'Koch', 'Kramer', 'Lamb', 'Lambert', 'Lancaster', 'Landry', 'Lane', 'Lang', 'Langley', 'Lara', 'Larsen', 'Larson', 'Lawrence', 'Lawson', 'Le', 'Leach', 'Leblanc', 'Lee', 'Leon', 'Leonard', 'Lester', 'Levine', 'Levy', 'Lewis', 'Lindsay', 'Lindsey', 'Little', 'Livingston', 'Lloyd', 'Logan', 'Long', 'Lopez', 'Lott', 'Love', 'Lowe', 'Lowery', 'Lucas', 'Luna', 'Lynch', 'Lynn', 'Lyons', 'Macdonald', 'Macias', 'Mack', 'Madden', 'Maddox', 'Maldonado', 'Malone', 'Mann', 'Manning', 'Marks', 'Marquez', 'Marsh', 'Marshall', 'Martin', 'Martinez', 'Mason', 'Massey', 'Mathews', 'Mathis', 'Matthews', 'Maxwell', 'May', 'Mayer', 'Maynard', 'Mayo', 'Mays', 'Mcbride', 'Mccall', 'Mccarthy', 'Mccarty', 'Mcclain', 'Mcclure', 'Mcconnell', 'Mccormick', 'Mccoy', 'Mccray', 'Mccullough', 'Mcdaniel', 'Mcdonald', 'Mcdowell', 'Mcfadden', 'Mcfarland', 'Mcgee', 'Mcgowan', 'Mcguire', 'Mcintosh', 'Mcintyre', 'Mckay', 'Mckee', 'Mckenzie', 'Mckinney', 'Mcknight', 'Mclaughlin', 'Mclean', 'Mcleod', 'Mcmahon', 'Mcmillan', 'Mcneil', 'Mcpherson', 'Meadows', 'Medina', 'Mejia', 'Melendez', 'Melton', 'Mendez', 'Mendoza', 'Mercado', 'Mercer', 'Merrill', 'Merritt', 'Meyer', 'Meyers', 'Michael', 'Middleton', 'Miles', 'Miller', 'Mills', 'Miranda', 'Mitchell', 'Molina', 'Monroe', 'Montgomery', 'Montoya', 'Moody', 'Moon', 'Mooney', 'Moore', 'Morales', 'Moran', 'Moreno', 'Morgan', 'Morin', 'Morris', 'Morrison', 'Morrow', 'Morse', 'Morton', 'Moses', 'Mosley', 'Moss', 'Mueller', 'Mullen', 'Mullins', 'Munoz', 'Murphy', 'Murray', 'Myers', 'Nash', 'Navarro', 'Neal', 'Nelson', 'Newman', 'Newton', 'Nguyen', 'Nichols', 'Nicholson', 'Nielsen', 'Nieves', 'Nixon', 'Noble', 'Noel', 'Nolan', 'Norman', 'Norris', 'Norton', 'Nunez', 'Obrien', 'Ochoa', 'Oconnor', 'Odom', 'Odonnell', 'Oliver', 'Olsen', 'Olson', 'Oneal', 'Oneil', 'Oneill', 'Orr', 'Ortega', 'Ortiz', 'Osborn', 'Osborne', 'Owen', 'Owens', 'Pace', 'Pacheco', 'Padilla', 'Page', 'Palmer', 'Park', 'Parker', 'Parks', 'Parrish', 'Parsons', 'Pate', 'Patel', 'Patrick', 'Patterson', 'Patton', 'Paul', 'Payne', 'Pearson', 'Peck', 'Pena', 'Pennington', 'Perez', 'Perkins', 'Perry', 'Peters', 'Petersen', 'Peterson', 'Petty', 'Phelps', 'Phillips', 'Pickett', 'Pierce', 'Pittman', 'Pitts', 'Pollard', 'Poole', 'Pope', 'Porter', 'Potter', 'Potts', 'Powell', 'Powers', 'Pratt', 'Preston', 'Price', 'Prince', 'Pruitt', 'Puckett', 'Pugh', 'Quinn', 'Ramirez', 'Ramos', 'Ramsey', 'Randall', 'Randolph', 'Rasmussen', 'Ratliff', 'Ray', 'Raymond', 'Reed', 'Reese', 'Reeves', 'Reid', 'Reilly', 'Reyes', 'Reynolds', 'Rhodes', 'Rice', 'Rich', 'Richard', 'Richards', 'Richardson', 'Richmond', 'Riddle', 'Riggs', 'Riley', 'Rios', 'Rivas', 'Rivera', 'Rivers', 'Roach', 'Robbins', 'Roberson', 'Roberts', 'Robertson', 'Robinson', 'Robles', 'Rocha', 'Rodgers', 'Rodriguez', 'Rodriquez', 'Rogers', 'Rojas', 'Rollins', 'Roman', 'Romero', 'Rosa', 'Rosales', 'Rosario', 'Rose', 'Ross', 'Roth', 'Rowe', 'Rowland', 'Roy', 'Ruiz', 'Rush', 'Russell', 'Russo', 'Rutledge', 'Ryan', 'Salas', 'Salazar', 'Salinas', 'Sampson', 'Sanchez', 'Sanders', 'Sandoval', 'Sanford', 'Santana', 'Santiago', 'Santos', 'Sargent', 'Saunders', 'Savage', 'Sawyer', 'Schmidt', 'Schneider', 'Schroeder', 'Schultz', 'Schwartz', 'Scott', 'Sears', 'Sellers', 'Serrano', 'Sexton', 'Shaffer', 'Shannon', 'Sharp', 'Sharpe', 'Shaw', 'Shelton', 'Shepard', 'Shepherd', 'Sheppard', 'Sherman', 'Shields', 'Short', 'Silva', 'Simmons', 'Simon', 'Simpson', 'Sims', 'Singleton', 'Skinner', 'Slater', 'Sloan', 'Small', 'Smith', 'Snider', 'Snow', 'Snyder', 'Solis', 'Solomon', 'Sosa', 'Soto', 'Sparks', 'Spears', 'Spence', 'Spencer', 'Stafford', 'Stanley', 'Stanton', 'Stark', 'Steele', 'Stein', 'Stephens', 'Stephenson', 'Stevens', 'Stevenson', 'Stewart', 'Stokes', 'Stone', 'Stout', 'Strickland', 'Strong', 'Stuart', 'Suarez', 'Sullivan', 'Summers', 'Sutton', 'Swanson', 'Sweeney', 'Sweet', 'Sykes', 'Talley', 'Tanner', 'Tate', 'Taylor', 'Terrell', 'Terry', 'Thomas', 'Thompson', 'Thornton', 'Tillman', 'Todd', 'Torres', 'Townsend', 'Tran', 'Travis', 'Trevino', 'Trujillo', 'Tucker', 'Turner', 'Tyler', 'Tyson', 'Underwood', 'Valdez', 'Valencia', 'Valentine', 'Valenzuela', 'Vance', 'Vang', 'Vargas', 'Vasquez', 'Vaughan', 'Vaughn', 'Vazquez', 'Vega', 'Velasquez', 'Velazquez', 'Velez', 'Villarreal', 'Vincent', 'Vinson', 'Wade', 'Wagner', 'Walker', 'Wall', 'Wallace', 'Waller', 'Walls', 'Walsh', 'Walter', 'Walters', 'Walton', 'Ward', 'Ware', 'Warner', 'Warren', 'Washington', 'Waters', 'Watkins', 'Watson', 'Watts', 'Weaver', 'Webb', 'Weber', 'Webster', 'Weeks', 'Weiss', 'Welch', 'Wells', 'West', 'Wheeler', 'Whitaker', 'White', 'Whitehead', 'Whitfield', 'Whitley', 'Whitney', 'Wiggins', 'Wilcox', 'Wilder', 'Wiley', 'Wilkerson', 'Wilkins', 'Wilkinson', 'William', 'Williams', 'Williamson', 'Willis', 'Wilson', 'Winters', 'Wise', 'Witt', 'Wolf', 'Wolfe', 'Wong', 'Wood', 'Woodard', 'Woods', 'Woodward', 'Wooten', 'Workman', 'Wright', 'Wyatt', 'Wynn', 'Yang', 'Yates', 'York', 'Young', 'Zamora', 'Zimmerman'];
