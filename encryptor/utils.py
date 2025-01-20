from django.shortcuts import render
import random, math, sys, os




#### RSA ####
 
def convert_to_bin(plaintext):
    """
    Converts a given plaintext character by character into binary block form

    """
    converted_text = []

    for x in plaintext:
        # converts the char into a binary byte (8 binary bits)
        converted_text.append(int(format(ord(x), '08b')))

    return converted_text


def prime():
    """
    Used to generate a list of prime numbers,
    which are used in the calculation of the public/private keys
    """
    # 1.1: Generate Prime Numbers
    # Gen prime numbers between 2 and 500
    n = 2
    max_num = 500 # The max number we will iterate to in order to generate primes.
    primes = []
    while n <= max_num:
        for x in range(2, int(math.sqrt(n)) + 1):
            # By checking the sqrt(n), rather than n
            # speeds up calculation of prime numbers.
            if n % x == 0:
                # Not prime
                n+=1
        primes.append(n)
        n+=1

    # Now with our list of primes, we need to choose 2 random ones.
    p1 = [random.choice(primes), random.choice(primes)]
    primes = p1
    return primes


def keys(p,q):
    """
    Used to calculate the variable values used in the private key
    I also calculated a public key, I may try to implement a decryption method later
    if the user inputted the respective public key.
    """
    # 2.1 - We calc the RSA modulus by multiplying our prime numbers together.
    # It is used to calculate the range of ciphertext and plaintext.
    n = p * q

    # 2.2 - We calculate the Euler's Totient ϕ(n)
    # This is a value which is used in deriving the keys.
    eulers = (p - 1) * (q - 1)

    # 2.3 - Select the e value, which is used in the public key calculation
    # e can be freely chosen, but it must be comprime to ϕ.
        # which means no 2 numbers have no common divisor except 1.
    e = 0

    while True:
        # Will loop until we find a value which is coprime to ϕ.
        # I have to use a small amount of numbers as python return as error during the encryption
        # process as the calculation results in too large of a number.
        num = random.randint(0, 100)

        # Coprime is where 2 numbers have no common divisor except for 1.
        if math.gcd(eulers, num) == 1 and num > 1:
            e = num
            break

    # 2.4 - Select the d value, which is used in the private key calculation
    # d is the multiplicative inverse to e.
    # Which means that d * e = 1 if modulo ϕ(n)
    d = pow(e, -1, eulers)

    # 2.5 - Keys
    public_key = [n, d]
    private_key = [n, e]

    return [public_key, private_key]


def encrypt1(bin_list, private):
    """
    Encrypts the binary blocks with RSA
    Encrypted output is represented as binary blocks
    """

    encrypted_output = []
    print(bin_list[0], 'bi_list[0] in encrypt1 utils')
    print(private[1], 'private[1] in utils')
    print(private[0], 'private[0] in utils')

    for x in range(len(bin_list)):
        encrypted_output.append((bin_list[x] ** private[1]) % private[0])

    return encrypted_output


def convert_to_text(encrypted_output):
    """
    Converts the encrypted binary code into english

    Note:
        # Issue here however, my encrypted numbers were too large to convert back into
        # chr form. So I have to reduce these numbers so they are usable by Unicode
        # IE) keep them below 52 --> Unicode 65-90 (Uppercase), Unicode 97-122 (Lowercase)

    """

    ciphertext = []

    for x in range(len(encrypted_output)):
        value = encrypted_output[x] % 52

        # Now I map the reduced value to an upper or lowercase ASCII integer
        if value < 26:
            ciphertext.append(value + 65) # Uppercase
        else:
            ciphertext.append(value + 71) # Lowercase

    encrypted_text = ''
    for x in range(len(ciphertext)):
        encrypted_text+=str(chr(ciphertext[x]))

    return encrypted_text


#### RSA Above 


#### DSA #### 

    ## Step 1: Choose a large prime number p





### ElGamal ####

# I had to create a virtual environment through the VSCode terminal which 
# Saved a folder in the root dir of the project which will be used to hold the 
# the following library. And all other libraries which are not easily 
# imported into vscode.
#           https://emminex.hashnode.dev/how-to-install-python-libraries-in-visual-studio-code 

def prime_EG():
    """ 
    Step 1 of the key generation process is to select a large prime number 
    I wanted to select primes in the 2048 bit size. 
    But generating primes in the range 2**2047 to 2**2048 is too resource intensive.
        Tried 512 bits --> Too intensive
        Tried 128 bits --> Too intensive lol

    Decided to use a a small prime number range as in the RSA implementation.

    """
    primes = []
    for x in range(2,500):
        prime = True
        for y in range(2, x+1):
            if x % y == 0:
                prime = True 
                break
        if prime:
            primes.append(x)
    return random.choice(primes)
   

    

def primitive_element(p):
    """
    Step 2 of the key generation process is to select a primitive element a of the 
    multiplicative group z^* p 
    This set is composed of integers {1,2,...,p-1} 

    Must verify g^k mod p != 1 for all integers in the set K*p.

    """
    # Get values in set 
    set = []
    for i in range(1,p):
        set.append(i)

    # Check all numbers in range 1:p-1
    primitive_elements = []
    for x in range(1, p):
        # get g value (represented as x)

        # Since g^k mod p needs to produce all elements of Z*p 
        # exactly once as k runs from 1 to p-1 we can 
        # add results to dict
        dict = {}
        for j in set:
            dict[j] = 0 

        for y in range(1, p): #CAREFUL WE ITERATE UP TO P, BUT NOT ONTO P.
            # Get k values (represented as y)
            # Need to verify that the integer g^k mod p != 1 for all k < p-1
            # so we compute here save in dict 
            check = pow(x,y,p)
            if check not in dict.keys():
                continue

            elif dict[check] == 1:
                continue
            
            else:
                dict[check] +=1 
        
            # After we ensure the check val is in the set, and has no been visited before 
            # and we do this for every val generated by g,
            # We consider it a primitive element.
            primitive_elements.append(x)

    # With all primitive elements in the set{1..p-1} generated, 
    # I randomly select one
    return random.choice(primitive_elements)



def random_integer(p):
    """
    Step 3 requires us to choose a random integer from the set {2,3,...p-2}
    """

    # Compute the set
    set = []
    for i in range(2,p-1):
        set.append(i)

    # Choose a random integer from the set 
    return random.choice(set)


def b_calc_eg(a,d,p):
    """
    Step 4: Compute the Beta value.
    """
    return pow(a,d,p)



def gcd(p):
    """
    Step 5: Choose an ephemeral key (k) from the set {0,1,2,3..p-2}
    such that gcd(k,p-1) = 1
    Used math for easy gcd calculation 
    """

    possible_keys = []
    for x in range(0, p-1):
        if math.gcd(x, p-1) == 1:
            possible_keys.append(x)
    
    return random.choice(possible_keys)


def convert_to_integers(plaintext):
    """
    Step 6: 
    Convert the plaintext into integers/binary numbers letter by letter in 
    each word.
    Store the numbers in each word in nested lists.
    """

    # Split the plaintext into a list.
    p_list = plaintext.split()

    new_list = []
    # Convert each letter in each word to a integer representation and 
    # add to new_list     
    for x in range(len(p_list)):
        word = []
        for letter in p_list[x]:
            # Check if the letter is uppercase -- If so add a $ at end 
            # Can check for $ later to ID if upper case when mapping 
            # encrypted val to uppercase unicode range.
            if letter.isupper() == True: 
                converted = str(ord(letter)) + '$'
                word.append(converted)
            else:
                converted = str(ord(letter))
                word.append(converted)

        new_list.append(word)

    return new_list


def s_param(k,p, plaintext_integers):
    """
    Step 7: 
    Compute the signature parameters r and s, as r was calc in prior func
    we calc s. 
    """

    encrypted_phrase = []
    for x in range(len(plaintext_integers)):
        encrypted_word = []
        for y in range(len(plaintext_integers[x])):
            # We have to check if a letter is upper case by checking the final val 
            # in each integer 
            if str(plaintext_integers[x][y])[-1] == '$':
                encrypted_letter = int(plaintext_integers[x][y][:-1]) * k % p
                encrypted_word.append(str(encrypted_letter)+'$') # Add $ back to ID uppercase 
                
            else:
                encrypted_letter = int(plaintext_integers[x][y]) * k % p
                encrypted_word.append(str(encrypted_letter))
        encrypted_phrase.append(encrypted_word)
    return encrypted_phrase


def convert_to_text_EG(int_list):
    """
    Step 8:
    Converts the list of integers back into text. 
    Currently only handles lowercase values.
    """

    phrase = ''
    for x in range(len(int_list)):
        word = ''
        for y in range(len(int_list[x])):
            # Check if letter is upper case by looking for $ at end.
            if '$' in int_list[x][y]:
                # Uppercase is ASCII 65 to 90 inclusive 
                upper_range = 26 # 90-65 since inclusive we add 1.
                word += str(chr((int(int_list[x][y][:-1]) % upper_range)+65))


            else:
                # Lowercase letters 
                lower_range = 26 # AKA 26 letters in the alphabet.
                word += str(chr((int(int_list[x][y]) % lower_range)+97))

        phrase += word
        phrase += ' '
    return phrase