import os
import weaviate
import json

from dotenv import load_dotenv

load_dotenv()

client = weaviate.Client(
    url="http://localhost:8080/", 
)
nearText = {
    "concepts":
    ["rose", "expensive", "unisex", "delicious", "unoffensive"]
}
# generate_prompt = "Explain why this perfume might be well loved to someone who likes playing the strong, delicious flavours. the Perfumes's name is {name} from the brand: {brand}, with a description: {description}, and it is: {gender}."
# response = (
#     client.query
#     .get("Perfume", [
#     "name",
#     "description",
#     "brand",
#     "gender",
#     "top_notes",
#     "middle_notes",
#     "base_notes"])
#     .with_near_text(nearText)
#     .with_limit(5)
#     .with_additional(["distance"])
#     .do()
# )

# response = (
#     client.query.get("Perfume", ["name", "brand"])
#     .with_additional("id")
#     .with_limit(1).do()
# )

# print(response)
response = (
    client.query
    .get("Perfume", ["name", "brand"])
    .with_near_object({
        "id": "000d601c-56a7-41eb-bf64-3342600fd944"
    })
    .with_limit(5)
    .with_additional(["distance"])
    .do()
)

print(json.dumps(response, indent=2))
