function moeda(input) {
  valor = input.value;
  valor = valor.replace(/\D/g,"")                    //permite digitar apenas números
  valor = valor.replace(/(\d{1})(\d{8})$/,"$1.$2")   //coloca ponto antes dos últimos 8 digitos
  valor = valor.replace(/(\d{1})(\d{5})$/,"$1.$2")   //coloca ponto antes dos últimos 5 digitos
  valor = valor.replace(/(\d{1})(\d{2})$/,"$1,$2")   //coloca virgula antes dos últimos 2 digitos
  input.value = valor;
}
