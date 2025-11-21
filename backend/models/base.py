from sqlalchemy.ext.declarative import declarative_base

# declarative_base is a function from SQLAlchemy 
# that creates a base class for your database models. 
# Think of it as a “template” that all your model classes will inherit from.

# When you create a class that inherits from 
# Base (the result of declarative_base()), SQLAlchemy automatically:

#     Creates a database table based on your class definition
#     Maps class attributes to table columns
#     Provides methods to query and manipulate your data


# Base is created from declarative_base()
Base = declarative_base()
