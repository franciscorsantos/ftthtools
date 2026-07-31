# Importa as classes Flask e render_template do pacote flask.
# Flask é a classe principal que usamos para criar nossa aplicação web.
# render_template é uma função que renderiza um arquivo de template HTML.
from flask import Flask, render_template

# Cria uma instância da aplicação Flask.
# __name__ é uma variável especial em Python que obtém o nome do módulo atual.
# O Flask usa isso para saber onde procurar recursos como templates e arquivos estáticos.
app = Flask(__name__)

# Define a rota para a página inicial da aplicação.
@app.route('/')
def home():
    # Renderiza e retorna o template 'index.html' quando alguém acessa a URL raiz ('/').
    return render_template('index.html')

# Define a rota para a calculadora de rede desbalanceada.
@app.route('/desbalanceada')
def desbalanceada():
    # Renderiza o template 'desbalanceada.html' para a URL '/desbalanceada'.
    return render_template('desbalanceada.html')

# Define a rota para a calculadora de rede balanceada.
@app.route('/balanceada')
def balanceada():
    return render_template('balanceada.html')

# Define a rota para a calculadora de autonomia de bateria.
@app.route('/autonomia')
def autonomia():
    return render_template('autonomia.html')

# Define a rota para a ferramenta de cores de fibra.
@app.route('/cores')
def cores():
    return render_template('cores.html')

# Este bloco de código verifica se o script está sendo executado diretamente.
# Se for o caso, ele inicia o servidor de desenvolvimento do Flask.
if __name__ == '__main__':
    # app.run() inicia a aplicação.
    # debug=True ativa o modo de depuração, que fornece mais informações de erro e recarrega automaticamente o servidor quando o código é alterado.
    app.run(debug=True)
    