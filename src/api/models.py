from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    lastname = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)    
    password = db.Column(db.String(255), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    
    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "lastname": self.lastname,
            "email": self.email,
            
            # do not serialize the password, its a security breach
        }
    
class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Relación con el usuario
    name = db.Column(db.String(120), nullable=False) 
    time = db.Column(db.String(50), nullable=False)  
    score = db.Column(db.Integer, nullable=False)  
    level = db.Column(db.Integer, nullable=False)  
    position = db.Column(db.Integer, nullable=True) 

    user = db.relationship('User', backref='scores')  # Relación con el usuario

    def __repr__(self):
        return f'<Score {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "time": self.time,
            "score": self.score,
            "level": self.level,
            "position": self.position
        }
