import os
import csv
import weaviate
import pymongo
from dotenv import load_dotenv
load_dotenv()

def combine_lists(list1, list2):
    """Combines two lists, handling potential None values.

    Args:
        list1: The first list.
        list2: The second list.

    Returns:
        A combined list, or an empty list if both inputs are None.
    """

    combined_list = []
    if list1 is not None:
        combined_list.extend(list1)
    if list2 is not None:
        combined_list.extend(list2)
    return combined_list

mongoclient = pymongo.MongoClient(os.getenv('MONGODBURI'))

client = weaviate.Client(
    url="http://localhost:8080/", 
)

# client.schema.delete_class("Perfume")

class_obj = {
    "class": "Perfume",
    "description": "A class that represents a perfume and its related data such as reviews, pros, cons.. etc",
    "vectorizer": "text2vec-transformers",
    "moduleConfig": {
        "text2vec-transformers": {
            "vectorizeClassName": True,
        }
    },
    "properties": [
        {
            "name": "mongoid",
            "dataType": ["text"],
        },
        {
            "name": "name",
            "dataType": ["text"],
        },
        {
            "name": "brand",
            "dataType": ["text"],
        },
        {
            "name": "gender",
            "dataType": ["text"],
        },
        # {
        #     "name": "ACCORDS",
        #     "dataType": ["object[]"],
        # },
        {
            "name": "top_notes",
            "dataType": ["text"],
            "moduleConfig": {
            "text2vec-transformers": {
              "vectorizePropertyName": True
            }
          }
        },
        {
            "name": "middle_notes",
            "dataType": ["text"],
            "moduleConfig": {
            "text2vec-transformers": {
              "vectorizePropertyName": True
            }
          }
        },
        {
            "name": "base_notes",
            "dataType": ["text"],
            "moduleConfig": {
            "text2vec-transformers": {
              "vectorizePropertyName": True
            }
          }
        },
        {
            "name": "pros",
            "dataType": ["text[]"],
        },
        {
            "name": "cons",
            "dataType": ["text[]"],
        },
        {
            "name": "summary",
            "dataType": ["text"],
        },
        {
            "name": "description",
            "dataType": ["text"],
        },
        {
            "name": "reviews",
            "dataType": ["text[]"],
            "moduleConfig": {
            "text2vec-transformers": {
              "vectorizePropertyName": True
            }
          }
        },
        {
            "name": "image",
            "dataType": ["text"],
            "moduleConfig": {
            "text2vec-transformers": {
              "skip": True,
            }
          }
        },
    ],
}

# client.schema.create_class(class_obj)

db = mongoclient["test"]
collection = db["perfumes"]

all_documents = collection.find()



current_perfume = None
count = 0
try:
  with client.batch as batch:  # Initialize a batch process
    batch.batch_size = 100
    
    # Iterate through each row of data
    for perfume in all_documents:
      
      count+=1
      if count <= 1905:
        continue
      current_perfume = perfume
      
      gen_text = raw_top_string=raw_middle_string=raw_base_string = None
      
      if(perfume["GENDER"] == 0):
        gen_text = "For Females"
      elif(perfume["GENDER"] == 1):
        gen_text = "For Males"
      else:
        gen_text = "For Both Females and Males"
      
      print("gender ok")
      
      if perfume["TOP_NOTES"] != None:
        raw_top_string = ",".join(perfume["TOP_NOTES"])
        print("top ok")
      if perfume["MIDDLE_NOTES"] != None:    
        raw_middle_string = ",".join(perfume["MIDDLE_NOTES"])
        
      if perfume["BASE_NOTES"] != None:  
        raw_base_string = ",".join(perfume["BASE_NOTES"])
        print("mid ok")
        
      if perfume["BASE_NOTES"] != None:  
        raw_base_string = ",".join(perfume["BASE_NOTES"])
        print("bot ok")
        
      
      combined_reviews = combine_lists(perfume["POPULAR_REVIEWS"], perfume["NEGATIVE_REVIEWS"])
      print("reviews combined")
        
      perfume_id = str(perfume["_id"])
      print("id cleared")
        
      print(perfume_id)
        
      print(f"count: {count}")  
      properties = {
          "mongoid": perfume_id,
          "name": perfume["NAME"],
          "brand": perfume["BRAND"],
          "gender": gen_text,
          # "ACCORDS": perfume["ACCORDS"],
          "top_notes": raw_top_string,
          "middle_notes": raw_middle_string,
          "base_notes": raw_base_string,
          "pros": perfume["PROS"],
          "cons": perfume["CONS"],
          "summary": perfume["SUMMARY"],
          "description": perfume["DESC"],
          "reviews": combined_reviews,
          "image": perfume["IMAGE"],
      }

      batch.add_data_object(data_object=properties, class_name="Perfume")
      # print(f"{book[2]}: {uuid}", end='\n')
except Exception as e:
  print(f"something happened {e}. Failure at {current_perfume}. count: {count}")