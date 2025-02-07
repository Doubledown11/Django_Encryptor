// Encryption Output Placeholder Code 

document.getElementById('encrypt_output2', function () {
    addEventListener('')
});


document.getElementById('encrypt_output_c2', function () {

});



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

    // Find the min of the range (when input is a)
    let min_range_upper = ((0b1000001 ** 100) % private);


    // If the range is lowercase 

    // Find the max of the range (when input is z)
    let max_range_lower = ((0b1111010 ** 100) % private);

    // Find the min of the range (when input is a)
    let min_range_lower = ((0b1100001 ** 100) % private);

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
       
        // Find the range between the max and min
        let diff = lower_range_hi - lower_range_lo;

        // Break the range into 26 pieces, which we can map output to.
        let range = diff / 26;

        // Find which piece the output belongs to.
        prior = lower_range_lo; 
        letter_val=1;
        while (true) {
            // if enc_out is < prior --> as is in the first case 

            if (encrypted_output > prior && encrypted_output < (prior + range)) {
                // Found the letter 
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
                
                } else if (plaintext[y] == ' ') { 
                    letter.push(plaintext[y]);

                } else {
                    let converted = plaintext[y].charCodeAt().toString(2);
                    letter.push(converted);

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
    let max_num = 25;
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

    let check = true;
    let prime2 = 0; 
    while (check === true) {
        prime2 = Math.floor(Math.random() * primes.length);
        if (prime2 >= 1) {
            check = false;
        };
    };

    // Had to change below code --> 
    // return [prime1, prime2]
    // As the primes generated would later result in values which were above
    // the max integer JavaScript can work with. 
    return [7,11]
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
        // I have to use a smaller range of numbers to gen num as too large of a n val 
        // leads to values being larger than the max allowable integer in JavaScript later on.
        let num = Math.floor(Math.random() * 50);
        let gcd_ = gcd(eulers, num)
        // Coprime is where 2 numbers have no common divisor except for 1. 
        if (gcd(eulers, num) === 1 && num > 1) {
            e = num;
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

    // Attempt at creating a placeholder
    let placeholder = 'Nothing to Encrypt yet...';
    
    // Attempt at creating a placeholder        
    document.getElementById('encrypt_output3').innerHTML = placeholder; 
    

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
            current_input.pop();
            current_input.push(input_field.value);


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

                //Convert the encrypted binary back to text
                let encrypted_output = convert_to_text(ciphertext, private[0]);

                // now return encrypted input string to output. 
                document.getElementById('encrypt_output3').innerHTML = encrypted_output;
            }   


            // if the input field is now empty, we reset the list and keys
            else if (current_input[0].length > 1) {
                // Convert the characters in the input list to binary
                let last_word = current_input[current_input.length-1];
                let bin_list = convert_to_bin(last_word);
               
                // Encrypt
                let ciphertext = rsa_encrypt(bin_list, private);

                // Convert the encrypted binary back to text
                let encrypted_output = convert_to_text(ciphertext, private[0]);

                // Now return encrypted input string to output 
                document.getElementById('encrypt_output3').innerHTML = encrypted_output;
            } 

            // If current input is empty, we ensure the output has no values displayed within
            else {
                document.getElementById('encrypt_output3').innerHTML = placeholder;
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


function primitive_element(prime) {
    /* 
    Step 2 of the key generation process is to select a primitive element a of the 
    multiplicative group z^* p 
    This set is composed of integers {1,2,...,p-1} 

    Must verify g^k mod p != 1 for all integers in the set K*p.
    */

    // Get the values in the set 
    let set = [];
    for (let i = 1; i<prime; i++) {
        set.push(i);
    }

    let dict = {};
    for (let y = 0; y < set.length; y++) {
        dict[set[y]] = 0;
    };


    // Check all numbers in range 1:p-1
    let primitive_elements = [];
    for (let x = 1; x<prime; x++) {
        // Get g value (represented as x)
        let valid_g = true;

        // Since g^k mod p needs to produce all elements of Z*p
        // exactly once as k runs from 1 to p-1 we can 
        // add results to dict 
        for (let y = 0; y < set.length; y++) {
            dict[set[y]] = 0;
        };
    

        for (let z = 1; z<prime; z++) {
            // Get k values (represented as z)
            // Need to verify that the integer g^k mod p!=1  
            // for all k<p-1. So we compute here to save time.

            // If the current g(x) value is invalid, we skip the rest of its loop
            if (!valid_g) {
                continue 
            };


            let check = Math.pow(x,z) % prime 
            
            // Check if 'check' is in dict 
            if (dict[check] === 1) {
                valid_g = false;
                continue;
            } 
            // If check has not appeared before, we increment its value by one.
            else {
                dict[check] = 1; 
            };
        };


        // Ensure every value in dict has been covered only once
        for (let j in dict) {
            if (dict[j] === 0) {
                valid_g = false;
            };
        };     



        // if g^k mod prime covers all numbers in {1,2,3..p-1} exactly once 
        // it is valid and is considered a primitive element.
        if (valid_g) {
            primitive_elements.push(x);
        };
    };


    // With alll primitive elements in the set{1..p-1} generated, 
    // I randomly select one.
    // JavaScript rounding led to 0 being picked.    
    let rand = 0;
    while (rand === 0) {
        rand = Math.floor(Math.random() * primitive_elements.length);
    };
    return rand
};


function random_integer(prime) {
    /* 
    Requires us to choose a random integer from the set {3,2,..p-2}
    */ 

    // Compute the set 
    let set = [];
    for (let i = 2; i<prime-1; i++) {
        set.push(i);
    };

    // Choose a random integer from the set 
    return Math.floor(Math.random() * set.length)
};


function b_calc_eg(a,d,prime) {
    /*
    Compute the Beta value  
    */
    
    return Math.pow(a,d) % prime 
};


function gcd_eg(prime) {
    /*
    Choose an ephemeral key (K) from the set {0,1,2,3..p-2}
    such that gcd(k,p-1) = 1
    Used math for easy gcd calculation 
    */

    let possible_keys = [];
    for (let x = 0; x<prime-1; x++) {
        if (gcd(x, prime-1) === 1) {
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
        for (let y = 0; y<plaintext[x].length; y++) {  
            console.log(plaintext[x], 'ptext[x] in convert to ints loop #', x);
            
            // Check if the current letter is uppercase -- if so we add $ to the letters nested list 
            if (plaintext[x] === plaintext[x].toUpperCase() && plaintext[x] !== ' ') {
                let converted = plaintext[x].charCodeAt();
                letter.push(converted);
                letter.push('$');
            } else if (plaintext[x] === ' ') {
                letter.push(' ');
            }
            // If the current letter is lowercase 
            else {
                let converted = plaintext[x].charCodeAt();
                letter.push(converted);
            };
            new_list.push(letter);
            break;
        };
    }; 
    return new_list
};


function s_param(k, prime, plaintext_integers) {
    /* 
    Compute the signature parameters r and s, as r was calc in prior func
    we calc s.
    */ 

    console.log(plaintext_integers[0][0], 'ptext ints[0][0] in s_param');
    console.log(k, 'k in s_param');

    let num_push = 0;

    let encrypted = [];
    for (let x = 0; x<plaintext_integers.length; x++) {
        let encrypted_ = [];
        let done = false;
        for (let y = 0; y<plaintext_integers[x].length; y++) {
            // Check if the current letter is an upper or lower case 
            // by looking for the $
            if (plaintext_integers[x].length == 2) {
                if (!done) {
                    let encrypted_int = (plaintext_integers[x][0] * k) % prime;
                    encrypted_.push(encrypted_int);

                    console.log(encrypted_int, 'encrypted_int caps');

                    encrypted_.push('$');
                    done = true;
                    num_push++;
                }
            } else {
                let encrypted_int = (plaintext_integers[x][0] *k) % prime;
                
                console.log(encrypted_int, 'encrypted_int');

                encrypted_.push(encrypted_int);

            };
        };
        console.log(encrypted_.length, 'encrypted_ length');
        encrypted.push(encrypted_);
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
        let done = false;

        for (let y = 0; y<encrypted_ints[x].length; y++) {
            console.log(y, 'y loop number');
            console.log(encrypted_ints[x].length, 'length');
            // Check if letter is upper case.
            if (encrypted_ints[x].length === 2) {
                if (!done) {
                    // FIX MAPPING TECHNIQUE -- SEEMS TO LEAD TO COLLISIONS
                    letter+=String.fromCharCode((encrypted_ints[x][y] % 26) + 65);  
                    console.log(letter, 'letter');
                    done = true;
                };
            }
            // Check if letter is lowercase.
            else {
                if (encrypted_ints[x] === ' ') {
                    letter+=' ';
                } else {
                    letter+=String.fromCharCode((encrypted_ints[x][y]%26) + 97);
                    console.log(letter, 'letter in lowercase');
                };
            };
        };
        ciphertext+=letter;
    };
    console.log(ciphertext, 'ciphertext');
    return ciphertext 
};







document.addEventListener("DOMContentLoaded", function () {
    var input_field = document.getElementById("encrypt_input2");
    console.log("✅ JavaScript file loaded!");

    let current_input = [''];
    let keys_found = false;
    let public = null;
    let private = null; 
    let k = null;
    // Get prime number
    // Decided to use a static prime number here as the prime generation led to 
    // values larger then the max allowable integer in python
    let prime_ = 17;


    

    // Attempt at creating a placeholder
    let placeholder = 'Nothing to Encrypt yet...';
    
    // Attempt at creating a placeholder        
    document.getElementById('encrypted_output_c3').innerHTML = placeholder; 



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
            current_input.pop();
            current_input.push(input_field.value);

            if (current_input[0].length === 1) {
            
                // Choose a primitive element
                let a = primitive_element(prime_);

                // Choose a random integer d ∈ (from the set) {2,3,...p-2}
                let d = random_integer(prime_);

                // Compute B (Beta) = a^d mod p
                let b = b_calc_eg(a,d,prime_);

                // Public key is formed by (p,a,B) -- Usewd for encryption in
                // the ElGamal digital signature scheme. 
                let public = [prime_, a, b]

                // Private key is d -- Used for decryption 
                private = d 

                // Keys found
                keys_found = true;

                // Choose a random ephemeral key (K) which is an element in 
                // the set {0,1,2,...p-2} such that gcd(k,p-1) = 1
                // gcd is the greatest common divisor.
                k = gcd_eg(prime_); 

                // Convert the plaintext into integer values used in 
                // the encryption process with the public key.
                let plaintext = current_input[0];
                let plaintext_integers = convert_to_integers(plaintext);

                // Encrypt the integers in plaintext_integers
                let encrypted_ints = s_param(k, prime_, plaintext_integers);  

                // Convert the encrypted integers back into text 
                let encrypted_text = convert_to_text_eg(encrypted_ints);

                // Display output to the HTML page 
                document.getElementById('encrypted_output_c3').innerHTML = encrypted_text;


            } else if (current_input[0].length > 1) {
                
                // Convert the plaintext into integer values used in 
                // the encryption process with the public key.
                let plaintext = current_input[0];
                let plaintext_integers = convert_to_integers(plaintext);
            
                // Encrypt the integers in plaintext_integers
                let encrypted_ints = s_param(k, prime_, plaintext_integers);  
                
                // Convert the encrypted integers back into text 
                let encrypted_text = convert_to_text_eg(encrypted_ints);

                // Display output to the HTML page 
                document.getElementById('encrypted_output_c3').innerHTML = encrypted_text;
            }

             // If current input is empty, we ensure the output has no values displayed within
            else {
                document.getElementById('encrypted_output_c3').innerHTML = placeholder;
            };

        });
    } else {
        console.error("❌ ERROR: Input field NOT found! Check your HTML.");
    };
});









































