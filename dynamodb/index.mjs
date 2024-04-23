import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
    QueryCommand,
    BatchWriteCommand,
    PutCommand,
    DeleteItemCommand,
    DynamoDBDocumentClient
} from '@aws-sdk/lib-dynamodb'

export function db(table = process.env.TABLE) {
    const client = new DynamoDBClient({})
    const docClient = DynamoDBDocumentClient.from(client)

    async function set(item) {
        const command = new PutCommand({
            TableName: table,
            Item: item
        })

        const result = await docClient.send(command)
        return result
    }

    async function list(x) {
        const command = new QueryCommand({
            TableName: table,
            KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
            ExpressionAttributeValues: {
                ':pk': x.pk,
                ':sk': x.sk
            }
        })

        const res = await docClient.send(command)
        return res.Items ? res.Items : false
    }

    async function get(x) {
        try {
            const command = new GetCommand({
                TableName: table,
                Key: x
            })

            const res = await docClient.send(command)
            return res.Item ? res.Item : false
        } catch (e) {
            return false
        }
    }

    async function remove(x) {
        const command = new DeleteItemCommand({
            TableName: table,
            Key: x
        })
        const res = await docClient.send(command)
        return res
    }

    return {
        list,
        get,
        set,
        remove
    }
}
