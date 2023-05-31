import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { 
  aws_ec2 as ec2,
} from 'aws-cdk-lib';

export class TgVpcAttachStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /** create a vpc */
    const vpc = new ec2.Vpc(this, 'vpc', {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      natGateways: 0,
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'three',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        }
     ]
    })

    /** use the CfnTransitGatewayAttachment to attach to a Tg */
    new ec2.CfnTransitGatewayAttachment(this, 'attachment', {
      subnetIds: vpc.selectSubnets({subnetGroupName: 'three'}).subnetIds,
      transitGatewayId: new ec2.CfnTransitGateway(this, 'tg', {}).attrId,
      vpcId: vpc.vpcId,
      options: { 
        ApplianceModeSupport: 'enable'
      },
    });
  }
}