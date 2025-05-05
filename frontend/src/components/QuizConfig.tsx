import { Form, Select } from "antd";
function QuizConfig() {
  return (
    <div className="home-page-wrapper flex justify-center items-center h-svh">
      <div className="nav-container w-2/4 bg-white px-12 pt-6 rounded-2xl">
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ maxWidth: 600 }}
        >
          <div className="grid  ">
            <Form.Item label="Select:">
              <Select>
                <Select.Option value="demo">Demo</Select.Option>
                <Select.Option value="demo1">Demo1</Select.Option>
                <Select.Option value="demo2">Demo2</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Select:">
              <Select>
                <Select.Option value="demo">Demo</Select.Option>
                <Select.Option value="demo1">Demo1</Select.Option>
                <Select.Option value="demo2">Demo2</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
        <button></button>
      </div>
    </div>
  );
}

export default QuizConfig;
