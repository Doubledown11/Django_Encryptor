// Encryption Output Placeholder Code 

document.getElementById('encrypt_output2', function () {
    addEventListener('')
});


document.getElementById('encrypt_output_c2', function () {

});


// Below functions are used to get the keys prior to encryption
// TODO move to another file in js folder.
function gcd(a, b) {
    let small = Math.min(a,b);
    let high_common = 1;

    for (let x = 1; x <= small; x++) {
        if (a%x === 0 && b%x === 0) {
            high_common = x; 
        };
    };
    return high_common;

};
  

function mod_inverse(a,b) {
    for (let x = 1; x < b; x++) {
        if (((a%b) * (x%b)) % b == 1)
            return x;
    };
};


function map_range(private) {
    /*
    Determines the range the output values will later be reduced to
    ensuring different input characters do not lead to the same output 
    character. (IE a Collision - Ruins the decryption process)
    
    I used the largest possible binary number (Z) == 0b1011010,
    The largest possible value from the gcd function == 100,
    and the current value of n --> This will return 
    


    ITS WRONG! the modulo creates an issue where a larger binary number 
    may lead to a smaller max range value.
        Idea for fix: 
            Another function to iterate through all binary numbers a-z, 
            and A-Z.  
            Perform the below calculations using the current n rather than 100
            Create 2 dictionaries for each
            then iterate through each dict to find the low and high values
    */
    

    // If the range is uppercase
        
    // Find the max of the range (when input is z)
    let max_range_upper = ((0b1011010 ** 100) % private);
    console.log(max_range_upper, 'max up');

    // Find the min of the range (when input is a)
    let min_range_upper = ((0b1000001 ** 100) % private);
    console.log(min_range_upper, 'min up');



    // If the range is lowercase 

    // Find the max of the range (when input is z)
    let max_range_lower = ((0b1111010 ** 100) % private);
    console.log(max_range_lower, 'max down');

    // Find the min of the range (when input is a)
    let min_range_lower = ((0b1100001 ** 100) % private);
    console.log(min_range_lower, 'min down');

    return [[min_range_upper, max_range_upper], [min_range_lower, max_range_lower]]
};


function map_output(check, encrypted_output, private) {
    /* 
    Determines the letter the output numbers will be transformed too.
    */
    let ranges = map_range(private);    

    
    // If check is 1, we need to map to the uppercase range of Binary 
    // forms of the ASCII codes for A and Z  
    if (check === 1) {
        // Max_range is the max of the encryption calculation given the 
        // input is z (Highest bin number)
        let upper_range_hi = ranges[0][1];    
        let upper_range_lo = ranges[0][0];
        
        // Find the range between the max and min
        let diff = upper_range_hi - upper_range_lo;

        // Break the range into 26 pieces, which we can map output to.
        let range = diff / 26; 

        // Find which piece the output belongs to.
        prior = upper_range_lo;
        letter_val = 1;
        while (true) {
            // Iterate from low to high, by adding range each iteration
            // We also increment letter val each iteration.
            // if the encrypted output is in the current range we say output 
            // letter is based on the letter_val variable 
            
            if (encrypted_output > prior && encrypted_output < (prior + range)) {
                // Found the letter
                console.log(letter_val, 'letter val upper'); 
                return letter_val;
                
            } else {
                prior+= range;
                letter_val++;
            };  
        };
    } 
    // If lowercase char 
    else {
        let lower_range_hi = ranges[1][1];
        let lower_range_lo = ranges[1][0];
        console.log(lower_range_hi, 'low range hi');
        console.log(lower_range_lo, 'low range low');
        
        console.log(encrypted_output, 'encrypted output mapping func');

        // Find the range between the max and min
        let diff = lower_range_hi - lower_range_lo;
        console.log(diff, 'diff');

        // Break the range into 26 pieces, which we can map output to.
        let range = diff / 26;
        console.log(range, 'range');

        // Find which piece the output belongs to.
        prior = lower_range_lo; 
        letter_val=1;
        while (true) {
            // if enc_out is < prior --> as is in the first case 

            if (encrypted_output > prior && encrypted_output < (prior + range)) {
                // Found the letter 
                console.log(letter_val, 'letter_val');
                return letter_val;
                
            } 
            else {
                prior+= range;
                letter_val++;
            };
        };
    };
};


function rsa_encrypt(bin_list, private) {
    /* 
    Encrypts the binary blocks with RSA
    Encrypted output is represented as binary blocks
    */

    console.log(private[1], 'p1');
    console.log(private[0], 'p0');
    let encrypted_output = [];
    for (let x = 0; x < bin_list.length; x++) {
        let encrypted_letter = [];
        for (let y = 0; y < bin_list[x].length; y++) {
            if (bin_list[x].length === 2) {                
                encrypted_letter.push((bin_list[x][0] ** private[1]) % private[0]);    
                encrypted_letter.push('$');
                break;
            } else if (bin_list[x].length === 1) {
                if (bin_list[x][y] === ' ') {
                    encrypted_letter.push(' ');
                    break;
                } else {
                    encrypted_letter.push((bin_list[x][0] ** private[1]) % private[0]);
                    console.log(bin_list[x][0], 'bin_list x 0');
                    console.log(bin_list[x][0] ** private[1], 'pow');
                    console.log((bin_list[x][0] ** private[1]) % private[0], 'modded');
                    break;
                };
            };
        };
        encrypted_output.push(encrypted_letter);
    };

    return encrypted_output
};


function convert_to_text(encrypted_output, private) {
    /* 
    Converts the encrypted numbers into text based on their unicode values
    after being modulated to the range of upper or lower case english letters
    */ 
    
    let ciphertext = '';
    for (let x = 0; x < encrypted_output.length; x++) {
        console.log(encrypted_output[encrypted_output.length-1][0], 'enc x in c2t');
        let word = ''; 
        for (let y = 0; y < encrypted_output[x].length; y++) {
            if (encrypted_output[x].length === 2) {
                //Uppercase is ASCII 65 to 90 inclusive 
                //mapped_letter = map_output(1, encrypted_output[x][0], private)
                // word+=String.fromCharCode(mapped_letter+64);
                word+=String.fromCharCode((encrypted_output[x][y] % 26) + 65);
                break;
            } else {
                if (encrypted_output[x][y] === ' ') {
                    word+=' ';
                } 
                // Lowercase is ASCII 97 to 122 inclusive
                else {
                // mapped_letter 
                    // console.log(private, 'private');
                    // mapped_letter = map_output(0, encrypted_output[x][0], private)
                    // console.log(mapped_letter ,'mapped_letter!');
                    // word+=String.fromCharCode(mapped_letter+96);
                    word+= String.fromCharCode((encrypted_output[x][y] % 26) + 97);
                };
            };
        };
        console.log(word, 'word in c2t');
        ciphertext += word;
    };
    return ciphertext
};


function convert_to_bin(plaintext) {
    /*
    Converts letters in binary based on their unicode integer representations 
    */


    let bin_list = [];
    for (let x = 0; x < plaintext.length; x++) {
        let letter = [];

        // Iterate through the current input string, 
        // and check each value to see if its in uppercase. 
        for (let y = 0; y < plaintext.length; y++) {
            if (y === x) {
                // If letter is uppercase, we add a $ to it. 
                // Used to ID in later functions that its uppercase.
                if (plaintext[y] === plaintext[y].toUpperCase() && plaintext[y] !== ' ') {
                    let converted = plaintext[y].charCodeAt().toString(2);                 
                    letter.push(converted); 
                    letter.push('$');
                    console.log(converted, 'converted');
                
                } else if (plaintext[y] == ' ') { 
                    letter.push(plaintext[y]);

                } else {
                    let converted = plaintext[y].charCodeAt().toString(2);
                    letter.push(converted);
                    console.log(converted, 'converted low');

                };
                bin_list.push(letter);
                break;
            } else {
                continue;
            };
        };
    };
    return bin_list
};


function prime() {
    /*
    Used to generate a list of prime numbers,
    which are used in the calculation of the public/private keys 
    
    Generate primes between 2 and 165
    The max is 165 any values larger will lead to errors further in 
    the encryption process
    */
  
    let n = 2;
    let max_num = 50;
    let primes = [];

    while (n <= max_num) {
        let isPrime = true;
        for (let i=2; i < Math.floor(Math.sqrt(n) + 1); i++) {
            if (n % i) {
                // Not Prime so pass
                isPrime = false;
                break;
            };
            
            if (isPrime) {    
                // Is a prime so we add it to the primes list
                primes.push(n);

            };    
        };
        n++;
    };
        
    // Select 2 random values from the list
    let prime1 = Math.floor(Math.random() * primes.length);
    let prime2 = Math.floor(Math.random() * primes.length);
    
    return [prime1, prime2]
};


function keys() {
    /*
     Used to calculate the variable values used in the private key
    I also calculated a public key, I may try to implement a decryption method later
    if the user inputted the respective public key.
    */ 

    let primes = prime();
    let p = primes[0];
    let q = primes[1];


    // 2.1 - We calc the RSA modulus by multiplying our prime numbers together.
    // It is used to calculate the range of ciphertext and plaintext.
    let n = p * q;
    
    // 2.2 - We calculate the Euler's Totient ϕ(n)
    // This is a value which is used in deriving the keys
    let eulers = (p - 1) * (q - 1);


    // 2.3 - Select the e value, which is used in the public key calculation
    // e can be freely chosen, but it must be comprime to ϕ.
    // which means no 2 numbers have no common divisor except 1.
    let e = 0;
    let x = true;
    while (x) {
        // Will loop until we find a value which is coprime to ϕ.
        // I have to use a small amount of numbers as python return as error during the encryption
        // process as the calculation results in too large of a number.
        let num = Math.floor(Math.random() * 100);
        let gcd_ = gcd(eulers, num)
        // Coprime is where 2 numbers have no common divisor except for 1. 
        if (gcd(eulers, num) === 1 && num > 1) {
            e = num;
            console.log(e, 'e values in keys');
            x = false;
        };
    };

    // # 2.4 - Select the d value, which is used in the private key calculation
    // d is the multiplicative inverse to e.
    // Which means that d * e = 1 if modulo ϕ(n)
    let d = mod_inverse(eulers, e); 

    // 2.5 - keys    
    let public_key = [n, d];
    let private_key = [n, e];

    return [public_key, private_key]
};

    




document.addEventListener("DOMContentLoaded", function () {
   var input_field = document.getElementById("encrypt_input1");
    console.log("✅ JavaScript file loaded!");

    let current_input = [''];
    let keys_found = false;
    let public = null;
    let private = null; 

    if (input_field) {
        // If the value entered in the input is a backspace we remove
        // the value from the current_input list.                                                                                                                                                                                                            
        input_field.addEventListener('keydown', function(event) {
            if (event.key === "Backspace" || event.key === "Delete") {
                if ( current_input.length === 1 ) {
                    current_input.pop();
                    current_input.push('');
                } else {                                
                    current_input.pop();
                };
            };
        });


        input_field.addEventListener("input", function() {
            console.log("User Input:", input_field.value);
            current_input.pop();
            current_input.push(input_field.value);
            console.log('Input List:', current_input); 


            // If the input field has a single value, we have to calc a set of keys 
            if (current_input[0].length === 1) {
                // Get encryption keys
                let key_list = keys();
                public = key_list[0];
                private = key_list[1];
                keys_found = true;  

                // Convert the characters in the input list to binary
                let last_word = current_input[current_input.length-1];
                let bin_list = convert_to_bin(last_word);

                // Encrypt 
                let ciphertext = rsa_encrypt(bin_list, private);
                console.log(ciphertext, 'ciphertext_list');

                //Convert the encrypted binary back to text
                let encrypted_output = convert_to_text(ciphertext, private[0]);

                // now return encrypted input string to output. 
                document.getElementById('encrypt_output2').innerHTML = encrypted_output;
            }   


            // if the input field is now empty, we reset the list and keys
            else if (current_input[0].length > 1) {
                // Convert the characters in the input list to binary
                let last_word = current_input[current_input.length-1];
                console.log(last_word, 'last word');
                let bin_list = convert_to_bin(last_word);
               
                // Encrypt
                let ciphertext = rsa_encrypt(bin_list, private);
                console.log(ciphertext, 'ciphertext');

                // Convert the encrypted binary back to text
                let encrypted_output = convert_to_text(ciphertext, private[0]);

                // Now return encrypted input string to output 
                console.log("Final output b4 send to html, ", encrypted_output);
                document.getElementById('encrypt_output2').innerHTML = encrypted_output;
            };
        });
    } else {
        console.error("❌ ERROR: Input field NOT found! Check your HTML.");
    };
});



///////////////////////////////////////////////////////////////////
//             Above Code for the RSA Encryption Algorithm       //
//             Below Code for the ElGamal Encryption Algorithm   //
///////////////////////////////////////////////////////////////////



function primite_element(prime) {
    /* 
    Step 2 of the key generation process is to select a primitive element a of the 
    multiplicative group z^* p 
    This set is composed of integers {1,2,...,p-1} 

    Must verify g^k mod p != 1 for all integers in the set K*p.
    */

    // Get the values in the set 
    let set = [];
    for (let i = 1; i<p; i++) {
        set.push(i);
    }

    // Check all numbers in range 1:p-1
    let primitive_elements = [];
    for (let x = 1; x<p; x++) {
        // Get g value (represented as x)

        // Since g^k mod p needs to produce all elements of Z*p
        // exactly once as k runs from 1 to p-1 we can 
        // add results to dict 
        let dict = {};
        for (let y = 0; y < set.length; y++) {
            dict[set[y]] = 0;
        };
    

        for (let z = 1; z<p; z++) {
            // Get k values (represented as z)
            // Need to verify that the integer g^k mod p!=1  
            // for all k<p-1. So we compute here to save time.
            let check = Math.pow(x,z) % p
            
            // Check if 'check' is in dict
            
            for (let i = 0; i<dict.length; i++ ) {
                let in_ = false;
                for (let j = 0; j<Object.keys(dict).length; j++) {
                    if (check === Object.keys()[j]) {
                        in_ = true;
                    } 
                };
            };

            if (!in_) {
                continue;
            } else if (dict[check] === 1) {
                continue;
            } else if (in_) {
                dict[check]++;
            };
            
            // After we ensure the check val is in the set, and has not been visited 
            // before, and once we do this for every val generated by g, 
            // we consider it a primitive element.
            primitive_elements.push(x);  

        };
        // With alll primitive elements in the set{1..p-1} generated, 
        // I randomly select one.
        return Math.floor(Math.random() * primitive_elements.length);
    };
};


function random_integer(prime) {
    /* 
    Requires us to choose a random integer from the set {3,2,..p-2}
    */ 

    // Compute the set 
    let set = [];
    for (let i = 2; i<p-1; i++) {
        set.push(i);
    };

    // Choose a random integer from the set 
    return Math.floor(Math.random() * set.length)
};


function b_calc_eg(a,d,prime) {
    /*
    Compute the Beta value  
    */
    
    return Math.pow(a,d) % p
};


function gcd_eg(prime) {
    /*
    Choose an ephemeral key (K) from the set {0,1,2,3..p-2}
    such that gcd(k,p-1) = 1
    Used math for easy gcd calculation 
    */

    let possible_keys = [];
    for (let x = 0; x<p-1; x++) {
        if (gcd(x, p-1) === 1) {
            possible_keys.push(x);
        };
    };
    return Math.floor(Math.random() * possible_keys.length);
};


function convert_to_integers(plaintext) {
    /*
    Convert the plaintext into integers/binary numbers letter by letter in 
    each word.
    Store the numbers in each word in nested lists.
    */

    // Convert each letter into its ASCII integer representation and 
    // add to new_list
    let new_list = [];
    for (let x = 0; x<plaintext.length; x++) {
        let letter = [];
        
        // Check if the current letter is uppercase -- if so we add $ to the letters nested list 
        if (plaintext[x] === plaintext[x].toUpperCase() && plaintext[x] !== ' ') {
            let converted = plaintext.charCodeAt();
            letter.push(converted);
            letter.push('$');
        } else if (plaintext[x] === ' ') {
            letter.push(' ');
        }
        // If the current letter is lowercase 
        else {
            let converted = plaintext.charCodeAt();
            letter.push(converted);
        };
        new_list.push(letter);
        break;
    }; 
    return new_list
};


function s_param(k, prime, plaintext_integers) {
    /* 
    Compute the signature parameters r and s, as r was calc in prior func
    we calc s.
    */ 

    let encrypted = [];
    for (let x = 0; x<plaintext_integers.length; x++) {
        let encypted_ = [];
        for (let y = 0; y<plaintext_integers[x].length; y++) {
            // Check if the current letter is an upper or lower case 
            // by looking for the $.
            if (plaintext_integers[x][y].length == 2) {
                let encrypted_int = (plaintext_integers[x][0] * k) % p;
                encypted_.push(encrypted_int);
                encypted_.push('$');
            } else {
                let encrypted_int = (plaintext_integers[x][0] *k) % p;
                encypted_.push(encrypted_int);
                encypted_.push('$');
            };
        encrypted.push(encypted_);
        };
    };
    return encrypted
};
 

function convert_to_text_eg(encrypted_ints) {
    /*
    Converts the list of integers back into text. 
    Currently only handles lowercase values. 
    */

    let ciphertext = '';
    for (let x = 0; x<encrypted_ints.length; x++) {
        let letter = '';
        for (let y = 0; y<encrypted_ints[x].length; y++) {
            // Check if letter is upper case.
            if (encrypted_ints[x].length === 2) {
                // FIX MAPPING TECHNIQUE -- SEEMS TO LEAD TO COLLISIONS
                word+=String.fromCharCode((encrypted_ints % 26) + 65);
            } 
            // Check if letter is lowercase.
            else {
                if (encrypted_ints[x] === ' ') {
                    word+=' ';
                } else {
                    word+=String.fromCharCode((encrypted_ints%26) + 97);
                };
            };
        };
        ciphertext+=word;
    };
    return ciphertext 
};







document.addEventListener("DOMContentLoaded", function () {
    var input_field = document.getElementById("encrypt_input2");
    console.log("✅ JavaScript file loaded!");

    let current_input = [''];
    let keys_found = false;
    let public = null;
    let private = null; 

    if (input_field) {
        // If the value entered in the input is a backspace we remove
        // the value from the current_input list.                                                                                                                                                                                                            
        input_field.addEventListener('keydown', function(event) {
            if (event.key === "Backspace" || event.key === "Delete") {
                if ( current_input.length === 1 ) {
                    current_input.pop();
                    current_input.push('');
                } else {                                
                    current_input.pop();
                };
            };
        });


        input_field.addEventListener("input", function() {
            console.log("User Input:", input_field.value);
            current_input.pop();
            current_input.push(input_field.value);
            console.log('Input List:', current_input); 

            if (current_input[0].length === 1) {
                // Get prime number
                prime = prime()[0];
                
                // Choose a primitive element
                a = primite_element(prime);

                // Choose a random integer d ∈ (from the set) {2,3,...p-2}
                d = random_integer(prime);

                // Compute B (Beta) = a^d mod p
                b = b_calc_eg(a,d,prime);

                // Public key is formed by (p,a,B) -- Usewd for encryption in
                // the ElGamal digital signature scheme. 
                let public = [prime, a, b]

                // Private key is d -- Used for decryption 
                private = d 

                // Keys found
                keys_found = true;


                // Choose a random ephemeral key (K) which is an element in 
                // the set {0,1,2,...p-2} such that gcd(k,p-1) = 1
                // gcd is the greatest common divisor.
                let k = gcd_eg(prime); 

                // Convert the plaintext into integer values used in 
                // the encryption process with the public key.
                let plaintext = current_input[0];
                let plaintext_integers = convert_to_integers(plaintext);

                // Encrypt the integers in plaintext_integers
                let encrypted_ints = s_param(k, prime, plaintext_integers);  
                
                // Convert the encrypted integers back into text 
                let encrypted_text = convert_to_text_eg(encrypted_ints);

                // Display output to the HTML page 
                console.log("Final output b4 send to html, ", encrypted_text);
                document.getElementById('encrypt_output_c2').innerHTML = encrypted_text;


            } else {
                // Choose a random ephemeral key (K) which is an element in 
                // the set {0,1,2,...p-2} such that gcd(k,p-1) = 1
                // gcd is the greatest common divisor.
                let k = gcd_eg(prime); 

                // Convert the plaintext into integer values used in 
                // the encryption process with the public key.
                let plaintext = current_input[0];
                let plaintext_integers = convert_to_integers(plaintext);

                // Encrypt the integers in plaintext_integers
                let encrypted_ints = s_param(k, prime, plaintext_integers);  
                
                // Convert the encrypted integers back into text 
                let encrypted_text = convert_to_text_eg(encrypted_ints);

                // Display output to the HTML page 
                console.log("Final output b4 send to html, ", encrypted_text);
                document.getElementById('encrypt_output_c2').innerHTML = encrypted_text;
            };
        });
    } else {
        console.error("❌ ERROR: Input field NOT found! Check your HTML.");
    };
});









































