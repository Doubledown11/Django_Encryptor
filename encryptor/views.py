from django.shortcuts import render
import random, math 
from .utils import convert_to_bin, prime, convert_to_text, encrypt1, keys
from .utils import prime_EG, primitive_element, random_integer, b_calc_eg, convert_to_integers, gcd, s_param, convert_to_text_EG

#####################MAKE SURE TO LIST UNDERSTANDING CRYPTOGRAPHY A
#  TEXTBOOK FOR STUDENTS AND PRACTITIONERS IN SOURCES #######!######



# Create your views here.

def home(request):
    """sends user to the home page"""
    return render(request, 'home.html')


def grid(request):
    """sends user to the home page"""
    return render(request, 'gridview.html')

def responsive(request):
    return render(request, 'responsive.html')

### DSA Encrypt ###
def encrypt_dsa(request): 
    if request.method == 'POST':
        plaintext = request.POST.get('encrypt_dsa', '')

         # Create list of binary numbers which represent the encrypted message 
        bin_list = convert_to_bin(plaintext)

        # Select a private key 
        

## ElGamal Encryption Function ###
def elgamal(request):
    """
    Both parties must perform a diffie-hellman key exchange to derive a shared key k. 
    My program does not use this, rather we generate all needed material 
    and share the public key with anyone who wishes to use it.

    """
 
    if request.method=='POST':
        plaintext = request.POST.get('encrypt_gamal', '')

        # Step 1: Choose a large prime number 
        # NOTE: My primes calculated are not big enough
        prime = prime_EG()

        # Step 2: Choose a primitive element a of the multiplicative group Z*p or a subgroup of Z*p 
        # It appears to be a random number between 2 and the prime in step 1
        #           https://www.geeksforgeeks.org/elgamal-encryption-algorithm/ 
        a = primitive_element(prime)

        # Step 3: Choose a random integer d ∈ (from the set) {2,3,...p-2} 
        d = random_integer(prime)

        # Step 4: Compute B (Beta) = a^d mod p 
        b = b_calc_eg(a,d,prime)

        # Public key is formed by (p,a,B) -- Used for Encryption in the 
        # elgamal digital signature scheme TODO REMOVE FROM PROGRAM. 
        # ###### WARNING ##############!!!!!!!!!!!!!!!!!!!!!!###############ERROR
        public_key = (prime,a,b)

        # Private key is d -- Used for decryption (Shared alongside the signed text)
        # Signed text is encrypted then hashed?
        private_key = d

        # Choose a random ephemeral key (K) which is an element in the set {0,1,2,...p-2}
        # Such that gcd(k,p-1) = 1 
        # gcd is the greatest common divisor.
        k = gcd(prime)
        

        # Convert the plaintext into binary/integer values used in 
        # encryption process with pub key. 
        # Is a matrix with integer values for each letter in each word 
        # each nested list is a word in plaintext.
        plaintext_integers = convert_to_integers(plaintext)

        # Encrypt the integers/binary list
        encrypted_ints = s_param(k,prime, plaintext_integers)

        # Convert the encrypted integers back into text
        encrypted_text = convert_to_text_EG(encrypted_ints)

        return render(request, 'home.html', {'encrypted_text':encrypted_text})





##### Above is helper functions for the encrypt view #####

### RSA Encrypt ###
def encrypt(request):
    if request.method == 'POST':
        plaintext = request.POST.get('encrypt_input1', '')

        # Create list of binary numbers which represent the encrypted message 
        bin_list = convert_to_bin(plaintext)
        

        # Determine the prime numbers to be used in the encryption process
        primes = prime()
        p = primes[0]
        q = primes[1]

        # Calculate the key value pairs
        keys_ = keys(p,q)
        public = keys_[0]
        private = keys_[1]

        # Encryption
        encrypted = encrypt1(bin_list, private)

        # Convert the encrypted binary back into text form. 
        ciphertext = convert_to_text(encrypted)

        return render(request, 'home.html', {'ciphertext':ciphertext})
        


