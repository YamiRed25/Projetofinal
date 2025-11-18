from flask import Flask, render_template, request, redirect, url_for, session, flash
import sqlite3

app = Flask(__name__)
app.secret_key = 'chave_secreta_123'

# === CRIAR BANCO DE DADOS ===
def criar_banco():
    conexao = sqlite3.connect('banco.db')
    cursor = conexao.cursor()

    # tabela de produtos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            preco REAL NOT NULL
        )
    ''')

    # tabela de usuários
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL
        )
    ''')

    conexao.commit()
    conexao.close()

criar_banco()

# === FUNÇÃO DE CONEXÃO ===
def get_db_connection():
    con = sqlite3.connect('banco.db')
    con.row_factory = sqlite3.Row
    return con


# === ROTAS ===
@app.route('/')
def index():
    conexao = get_db_connection()
    produtos = conexao.execute('SELECT nome, preco FROM produtos').fetchall()
    conexao.close()
    return render_template('index.html', produtos=produtos)


@app.route('/adicionar', methods=['POST'])
def adicionar():
    nome = request.form['nome']
    preco = request.form['preco']

    conexao = get_db_connection()
    conexao.execute('INSERT INTO produtos (nome, preco) VALUES (?, ?)', (nome, preco))
    conexao.commit()
    conexao.close()
    flash('✅ Produto adicionado com sucesso!')
    return redirect(url_for('index'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        senha = request.form['senha']

        con = get_db_connection()
        usuario = con.execute('SELECT * FROM usuarios WHERE email = ? AND senha = ?', (email, senha)).fetchone()
        con.close()

        if usuario:
            session['usuario'] = usuario['nome']
            return redirect(url_for('home'))
        else:
            flash('❌ E-mail ou senha incorretos!', 'erro')

    return render_template('login.html')


@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'POST':
        nome = request.form['nome']
        email = request.form['email']
        senha = request.form['senha']

        con = get_db_connection()
        try:
            con.execute('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', (nome, email, senha))
            con.commit()
            flash('✅ Cadastro realizado com sucesso! Faça login.', 'sucesso')
            return redirect(url_for('login'))
        except sqlite3.IntegrityError:
            flash('⚠️ E-mail já cadastrado!', 'erro')
        finally:
            con.close()

    return render_template('cadastro.html')


@app.route('/home')
def home():
    if 'usuario' in session:
        return render_template('home.html', usuario=session['usuario'])
    else:
        return redirect(url_for('login'))


@app.route('/logout')
def logout():
    session.pop('usuario', None)
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(debug=True)
