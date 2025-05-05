import { Form, Select, Button } from "antd";
function QuizConfig() {
  function onFinish(values: object) {
    console.log(values);
  }
  return (
    <div className="home-page-wrapper flex justify-center items-center h-svh">
      <div className="nav-container w-2/4 bg-white px-12 pt-6 rounded-2xl">
        <div className="sign-up-form-heading  items-center flex justify-center mb-8">
          <h1 className="sign-up-heading text-gray-900 text-4xl">
            Select Quiz Options
          </h1>
        </div>
        <Form
          labelAlign="left"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 15 }}
          layout="horizontal"
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          requiredMark={false}
        >
          <div className="grid">
            <Form.Item
              label="Select Category:"
              name={"category"}
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select placeholder="Select Category...">
                <Select.Option value="any">Any Category</Select.Option>
                <Select.Option value="9">General Knowledge</Select.Option>
                <Select.Option value="17">Science & Nature</Select.Option>
                <Select.Option value="18">Computers</Select.Option>
                <Select.Option value="19">Mathematics</Select.Option>
                <Select.Option value="21">Sports</Select.Option>
                <Select.Option value="22">Geography</Select.Option>
                <Select.Option value="23">History</Select.Option>
                <Select.Option value="27">Animals</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Select Difficulty:"
              name={"difficulty"}
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select placeholder="Select Difficulty...">
                <Select.Option value="any">Any Difficulty</Select.Option>
                <Select.Option value="easy">Easy</Select.Option>
                <Select.Option value="medium">Medium</Select.Option>
                <Select.Option value="hard">Hard</Select.Option>
              </Select>
            </Form.Item>
            <div className="ml-1">
              <Form.Item>
                <Button type="primary" htmlType="submit" className="ml-10">
                  Submit
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default QuizConfig;
