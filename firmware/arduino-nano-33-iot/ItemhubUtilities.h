#include <vector>
#include <numeric>
#include "tiny-json.h"

enum
{
    MAX_FIELDS = 64
};
json_t pool[MAX_FIELDS];

class ItemhubPin
{
public:
    ItemhubPin(byte pin, std::string pinString, std::string mode)
    {
        this->pin = pin;
        this->pinString = pinString;
        this->mode = mode;
        if (this->mode == "SWITCH")
        {
            pinMode(pin, OUTPUT);
        }
        if (this->mode == "SENSOR")
        {
            Serial.println("sensor");
            Serial.println(pinString.c_str());
            pinMode(pin, INPUT);
        }
    }
    byte pin;
    std::string pinString;
    std::string mode;
};

class ItemhubUtilities
{
public:
    static std::string Extract(std::string &jsonString, const char *key)
    {
        json_t const *jsonData = json_create((char *)jsonString.c_str(), pool, MAX_FIELDS);
        json_t const *jsonField = json_getProperty(jsonData, key);
        const char *value = json_getValue(jsonField);
        return std::string(value);
    }

    static void Test()
    {
        char str[] = "{\"phoneList\": [\n"
                     "\t\t{ \"type\": \"personal\", \"number\": \"09832209761\" },\n"
                     "\t\t{ \"type\": \"fax\", \"number\": \"91-342-2567692\" }\n"
                     "\t]}";

        json_t const *jsonData = json_create(str, pool, MAX_FIELDS);
        json_t const *phoneList = json_getProperty(jsonData, "phoneList");
        json_t const *phone;

        for (phone = json_getChild(phoneList); phone != 0; phone = json_getSibling(phone))
        {
            if (JSON_OBJ == json_getType(phone))
            {
                char const *phoneNumber = json_getPropertyValue(phone, "number");
                if (phoneNumber)
                {
                    Serial.println(phoneNumber);
                }
            }
        }
    }
};
