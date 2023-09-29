from flask import Flask, request, jsonify, send_file
from psycopg2 import connect, extras
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:5001"}})

host = 'localhost'
port = 5432
dbname = 'testinho'
username = 'postgres'
password = 123

def conectando():
    conn = connect(host=host, port=port, dbname=dbname, user=username, password=password)
    return conn



@app.get('/api/transacoes')
def pegar_transacoes():
    conn = conectando()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)
    
    cur.execute("SELECT * FROM transacoes")
    transacoes = cur.fetchall()

    cur.close()
    conn.close()
    
    return jsonify(transacoes)
    
    # return 'pegando transacao'



@app.post('/api/transacoes')
def criar_transacoes():
    nova_transacao = request.get_json()
    descricao = nova_transacao['descricao']
    valor = nova_transacao['valor']
    tipo = nova_transacao['tipo']

    conn = conectando()
    cur = conn.cursor()
    
    cur.execute('INSERT INTO transacoes(descricao, valor, tipo) VALUES (%s, %s, %s) RETURNING *', (descricao, valor, tipo))
    novo_usuario_criado = cur.fetchone()
    print(novo_usuario_criado)
    conn.commit()
    
    conn.close()
    cur.close()
    
    return jsonify(novo_usuario_criado)
    
    
    
@app.delete('/api/transacoes/<idtransacao>')
def deletar_transacoes(idtransacao):
    conn = conectando()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('DELETE FROM transacoes WHERE idTransacao = %s RETURNING * ', (idtransacao,))
    
    transacao = cur.fetchone()

    print(transacao)

    conn.commit()

    conn.close()
    cur.close()

    if transacao is None:
        return jsonify({'message': 'Transacão não econtrada'}), 404
    
    return jsonify(transacao)



@app.put('/api/transacoes/<idtransacao>')
def put_transacoes(idtransacao):
    
    conn = conectando()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    novo_usuario = request.get_json()
    descricao = novo_usuario['descricao'] 
    valor = novo_usuario['valor'] 
    tipo = novo_usuario['tipo'] 
    
    cur.execute('UPDATE transacoes SET descricao = %s, valor = %s, tipo = %s WHERE idtransacao = %s RETURNING *', (descricao, valor, tipo, idtransacao))
    usuario_atualizado = cur.fetchone()
    
    conn.commit()
    
    cur.close()
    conn.close()
    
    if usuario_atualizado is None:
        return jsonify({"message": "Transação não encontrada"}), 404 
    
    return jsonify(usuario_atualizado)




@app.get('/api/transacoes/<idtransacao>')
def pegar_transacao(idtransacao):
    print(idtransacao)
    conn = conectando()
    cur = conn.cursor(cursor_factory=extras.RealDictCursor)

    cur.execute('SELECT * FROM transacoes WHERE idTransacao = %s', (idtransacao,))
    transacao = cur.fetchone()

    cur.close()
    conn.close()
    
    if transacao is None:
        return jsonify({'message': 'Transacão não econtrada'}), 404
    
    
    
@app.get('/home')    
def home():
    return send_file('/home')



if __name__ == '__main__':
    app.run(debug=True, port=5000)