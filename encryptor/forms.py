from django import forms

# Create your views here.

class encrypt_form(forms.Form):
    to_encrypt = forms.CharField(label='Encrypt this')