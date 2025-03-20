import React from 'react';
import { Modal, Form, Input, Button, } from "antd"

const CreateAndJoinModal = ({ title, open, onCancel, onSubmit }) => {
    const [form] = Form.useForm();
    return (
        <Modal
            title={title}
            open={open}
            onCancel={onCancel}
            footer={null}
            maskClosable={false}
            afterOpenChange={() => {
                form.getFieldInstance('name')?.focus()
            }}
        >
            <Form layout="vertical" onFinish={onSubmit} form={form}>
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter Name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Room ID" name="roomId" rules={[{ required: true, message: 'Please enter Room ID!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter a password!' }]}>
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {title}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CreateAndJoinModal