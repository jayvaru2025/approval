import json
import os
import boto3
from botocore.exceptions import ClientError

# Get table name from environment variable
TABLE_NAME = os.environ.get('CONFIG_TABLE_NAME')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):
    try:
        print("event : ", event)
         # Extract and normalize input parameters
        parameters = event.get('Details', {}).get('Parameters', {})
        config_type = parameters.get('configType', '').strip()
        value = parameters.get('value', '').strip()
        language_code = parameters.get('languageCode', '').strip()
        country_code = parameters.get('countryCode', '').strip()

        # Validate required fields
        if not config_type or not value:
            return {
                "dataFound": False,
                "error": "Missing configType or value"
            }
        
        # Build path based on whether languageCode and countryCode are provided
        if language_code and country_code:
            path = f"/{config_type}/{value}/{language_code}/{country_code}"
        else:
            path = f"/{config_type}/{value}"

        print("path: ", path)
        # Query DynamoDB using the constructed path
        response = table.get_item(Key={"path": path})
        print("response: ", response)

        if "Item" in response:
            connect_attributes = response["Item"].get("attributes", {})
            # Convert all values to strings for Connect compatibility
            # connect_attributes = {k: str(v) for k, v in attributes.items()}
            connect_attributes["dataFound"] = True
            connect_attributes["configPathUsed"] = path
            print(f"connect_attributes: {connect_attributes}")
            return connect_attributes
        else:
            return {
                "dataFound": False,
                "configPathUsed": path,
                "error": "Configuration not found"
            }
        
    except ClientError as e:
        return {
            "dataFound": False,
            "error": "DynamoDB ClientError",
            "message": str(e)
        }
    except Exception as e:
        return {
            "dataFound": False,
            "error": "Internal error",
            "message": str(e)
        }