import { AnimationControls, motion } from 'framer-motion';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import { Col, Layout, Menu, Row, message } from 'antd';
import { Button, ButtonGroup } from '@mui/material';

import {
  HomeOutlined,
  Input,
  MenuOutlined,
  UploadOutlined,
  Output,
  ViewInArOutlined,
  Download,
} from '@mui/icons-material';

import StructureWindow from '@app/components/Structure';
import SequenceArea from '@app/components/SequenceArea';

import handleUpload from '@app/functions/handleUpload';
import handlePrediction from '@app/functions/handlePrediction';

import Mol from '@app/classes/Mol';
import handleExport from '@app/functions/handleExport';

const { Content, Sider, Header } = Layout;

function MenuLabel(props: { label: string }) {
  return (
    <motion.b
      style={{
        letterSpacing: '1rem',
      }}
    >
      {props.label}
    </motion.b>
  );
}

const MENU = [
  {
    key: 'input',
    label: <MenuLabel label="输入" />,
    title: '输入',
    icon: <Input />,
    children: [
      {
        key: 'upload',
        label: <MenuLabel label="上传" />,
        title: '上传序列文本文件',
        icon: <UploadOutlined />,
      },
    ],
  },

  {
    key: 'output',
    label: <MenuLabel label="输出" />,
    title: '输出',
    icon: <Output />,
    children: [
      {
        key: 'structure',
        label: <MenuLabel label="结构" />,
        title: '结构',
        icon: <ViewInArOutlined />,
      },
      {
        key: 'export',
        label: <MenuLabel label="导出" />,
        title: '导出预测结果为文件',
        icon: <Download />,
      },
    ],
  },
];

function Tasks() {
  const [menuCollapsed, setMenuCollapsed] = React.useState(false);
  const [structureWindowAnimationControl, setStructureWindowAnimationControl] =
    React.useState<null | AnimationControls>(null);
  const [mol, setMols] = React.useState<{ [id: string]: Mol }>({});
  const [lastPrediction, setLastPrediction] = React.useState('');

  const sequenceAreaRef = React.useRef<null | HTMLTextAreaElement>(null);
  const structureCanvasContainer = React.useRef<null | HTMLDivElement>(null);

  const navigate = useNavigate();

  const renderMol = React.useCallback((pdb: string) => {
    const timeTag = new Date().getTime();
    const id = timeTag.toString();
    const newMol = new Mol(pdb, structureCanvasContainer.current, id);
    setMols((origin) => {
      origin[id] = newMol;
      return origin;
    });
    return id;
  }, []);

  return (
    <Layout>
      <Sider trigger={null} collapsed={menuCollapsed}>
        <Menu
          onClick={async ({ key }) => {
            switch (key) {
              case 'upload':
                sequenceAreaRef.current.value = await handleUpload();
                break;
              case 'structure':
                structureWindowAnimationControl.start({
                  zIndex: 1,
                });
                break;
              case 'export':
                handleExport(lastPrediction);
                break;
              default:
            }
          }}
          selectable={false}
          mode="inline"
          theme="dark"
          items={MENU}
        />
      </Sider>
      <Layout
        style={{
          height: '100vh',
        }}
      >
        <Header
          style={{
            padding: 0,
            backgroundColor: 'white',
          }}
        >
          <Row justify="space-between">
            <Col>
              <Button
                onClick={() => {
                  setMenuCollapsed(!menuCollapsed);
                }}
                sx={{
                  height: '100%',
                  fontSize: '1rem',
                }}
              >
                <MenuOutlined />
              </Button>
            </Col>
            <Col
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ButtonGroup
                sx={{
                  padding: '0 1rem',
                }}
              >
                <Button
                  onClick={() => {
                    navigate('/');
                  }}
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    fontWeight: '600',
                    letterSpacing: '0.2rem',
                  }}
                  variant="outlined"
                >
                  <HomeOutlined />
                  返回
                </Button>
                <Button
                  onClick={async () => {
                    const indexResult = await axios
                      .get(
                        `/sequence?=amino_acid_seq=${sequenceAreaRef.current.value}`,
                      )
                      .then((result) => {
                        return result.data;
                      })
                      .catch((error) => {
                        console.error(error);
                        message.error('请求序列查询失败');
                        throw new Error('请求序列查询失败');
                      });
                    if (indexResult.success) {
                      if (indexResult.msg === '序列存在') {
                        message.info('序列存在');
                      } else if (indexResult.msg === '序列不存在') {
                        message.info('序列未录入');
                        message.info('正在录入新序列');
                        axios
                          .post('/sequence', {
                            data: {
                              amino_acid_seq: sequenceAreaRef.current.value,
                            },
                          })
                          .then((result) => {
                            if (result.data.success) {
                              message.success('新序列上传成功');
                            }
                          })
                          .catch((error) => {
                            console.error(error);
                            message.error('序列上传失败');
                            throw new Error('序列上传失败');
                          });
                      }
                    } else {
                      message.info('查询失败');
                    }
                    //
                    const result = await handlePrediction(
                      sequenceAreaRef.current.value,
                    );
                    setLastPrediction(result);
                    renderMol(result);
                    structureWindowAnimationControl.start({
                      zIndex: 1,
                    });
                  }}
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    fontWeight: '600',
                    letterSpacing: '0.2rem',
                  }}
                  variant="contained"
                >
                  提交
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Header>
        <Content>
          <SequenceArea ref={sequenceAreaRef} />
          <StructureWindow
            mols={mol}
            ref={structureCanvasContainer}
            handleClose={() => {
              structureWindowAnimationControl.set({
                zIndex: -1,
              });
            }}
            handleSort={(newMols) => {
              setMols(newMols);
              //
              const container = structureCanvasContainer.current;
              const canvases: { [id: string]: HTMLCanvasElement } = {};
              Array.from(container.children).forEach(
                (canvas: HTMLCanvasElement) => {
                  canvases[canvas.id] = canvas;
                },
              );
              const newIdArray = Object.keys(newMols);
              newIdArray.forEach((id) => {
                container.append(canvases[id]);
              });
            }}
            animationControl={(animationControl: AnimationControls) =>
              setStructureWindowAnimationControl(animationControl)
            }
            renderFromUpload={(file) => renderMol(file)}
          />
        </Content>
      </Layout>
    </Layout>
  );
}

export default Tasks;
